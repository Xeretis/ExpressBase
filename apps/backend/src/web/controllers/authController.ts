import {
    LoginBody,
    PasswordChangeBody,
    PasswordResetBody,
    PasswordResetQuery,
    RegisterBody,
    VerifyQuery,
} from "shared";
import { Request, Response } from "express";
import { TypedRequestBody, TypedRequestQuery, TypedRequestQueryBody } from "../../classes/requests";
import {
    createAccessToken,
    createAuthTokens,
    createResetToken,
    createVerifyToken,
    deleteAccessToken,
    deleteAccessTokensOfUser,
    deleteRefreshToken,
    deleteRefreshTokensOfUser,
    getRefreshTokenWithUser,
    getResetTokenWithUser,
    getVerifyTokenWithUser,
    setRefreshTokenUsedAt,
    setResetTokenUsedAt,
    setVerifyTokenUsedAt,
} from "../../contexts/auth/token";
import {
    getUserByEmail,
    login,
    register,
    setUserPassword,
    verifyUser,
} from "../../contexts/auth/user";

import { SendResetEmail } from "../../classes/jobs/SendResetEmail";
import { SendVerifyEmail } from "../../classes/jobs/SendVerifyEmail";
import bcrypt from "bcryptjs";
import dayjs from "dayjs";
import { defaultQueue } from "../../utils/queue";

export class AuthController {
    static RESFRESH_TOKEN_EXPIRES_IN_DAYS = 30;
    static ACCESS_TOKEN_EXPIRES_IN_MINUTES = 60;
    static VERIFY_TOKEN_EXPIRES_IN_DAYS = 1;
    static RESET_TOKEN_EXPIRES_IN_HOURS = 1;

    public static async register(
        req: TypedRequestBody<RegisterBody>,
        res: Response
    ): Promise<Response<any, Record<string, any>>> {
        const { username, email, password } = req.body;

        const expiresAt = dayjs().add(AuthController.VERIFY_TOKEN_EXPIRES_IN_DAYS, "day").toDate();

        const user = await register(email, username, password);
        const verifyToken = await createVerifyToken(user, expiresAt);

        await defaultQueue.add(
            `verify - ${Date.now().toString()}`,
            new SendVerifyEmail({ email: user.email, token: verifyToken.token })
        );

        return res.status(200).json({
            message: "Succeessful registration",
        });
    }

    public static async login(
        req: TypedRequestBody<LoginBody>,
        res: Response
    ): Promise<Response<any, Record<string, any>>> {
        const user = await login(req.body.email, req.body.password);

        if (!user) {
            return res.status(400).json({
                message: "Invalid input",
                errors: [
                    {
                        code: "invalid_credentials",
                        message: "The email or the password is invalid",
                        path: ["body", "email"],
                    },
                    {
                        code: "invalid_credentials",
                        message: "The email or the password is invalid",
                        path: ["body", "password"],
                    },
                ],
            });
        }

        let accessExpiresAt: Date;
        let accessToken: string;

        if (req.body.remember) {
            accessExpiresAt = dayjs()
                .add(AuthController.ACCESS_TOKEN_EXPIRES_IN_MINUTES, "minute")
                .toDate();
            const refreshExpiresAt = dayjs()
                .add(AuthController.RESFRESH_TOKEN_EXPIRES_IN_DAYS, "day")
                .toDate();

            const tokens = await createAuthTokens(user, accessExpiresAt, refreshExpiresAt);

            accessToken = tokens.accessToken;

            res.cookie("refresh_token", tokens.refreshToken, {
                httpOnly: true,
                expires: accessExpiresAt,
            });
        } else {
            accessExpiresAt = dayjs()
                .add(AuthController.ACCESS_TOKEN_EXPIRES_IN_MINUTES, "minute")
                .toDate();

            accessToken = await createAccessToken(user, accessExpiresAt);
        }

        return res.status(200).json({
            message: "Successful login",
            accessToken: {
                token: accessToken,
                expiresAt: accessExpiresAt,
            },
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
    }

    public static async refresh(
        req: Request,
        res: Response
    ): Promise<Response<any, Record<string, any>>> {
        const refreshToken = req.cookies.refresh_token;

        if (!refreshToken) {
            return res.status(400).json({
                message: "Invalid input",
                errors: [
                    {
                        code: "missing_refresh_token",
                        message: "Couldn't find refresh token",
                        path: ["cookies", "refreshToken"],
                    },
                ],
            });
        }

        const token = await getRefreshTokenWithUser(refreshToken);

        if (!token) {
            return res.status(400).json({
                message: "Invalid input",
                errors: [
                    {
                        code: "invalid_refresh_token",
                        message: "The refresh token is invlaid",
                        path: ["cookies", "refreshToken"],
                    },
                ],
            });
        }

        const user = token.user;

        if (token.usedAt) {
            await deleteRefreshToken(token);

            return res.status(400).json({
                message: "Invalid input",
                errors: [
                    {
                        code: "invalid_refresh_token",
                        message: "The refresh token is invlaid",
                        path: ["cookies", "refreshToken"],
                    },
                ],
            });
        }

        await setRefreshTokenUsedAt(token, new Date());

        const accessExpiresAt = dayjs()
            .add(AuthController.ACCESS_TOKEN_EXPIRES_IN_MINUTES, "minute")
            .toDate();
        const refreshExpiresAt = dayjs()
            .add(AuthController.RESFRESH_TOKEN_EXPIRES_IN_DAYS, "day")
            .toDate();

        const newTokens = await createAuthTokens(user, accessExpiresAt, refreshExpiresAt, token.id);

        res.cookie("refresh_token", newTokens.refreshToken, {
            httpOnly: true,
            expires: refreshExpiresAt,
        });

        return res.status(200).json({
            message: "Token successfully refreshed",
            accessToken: {
                token: newTokens.accessToken,
                expiresAt: accessExpiresAt,
            },
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
    }

    public static async logout(
        req: Request,
        res: Response
    ): Promise<Response<any, Record<string, any>>> {
        await deleteAccessToken(req.accessToken!);
        res.clearCookie("refresh_token");

        return res.status(200).json({
            message: "Successful logout",
        });
    }

    public static async verify(
        req: TypedRequestQuery<VerifyQuery>,
        res: Response
    ): Promise<Response<any, Record<string, any>>> {
        const token = await getVerifyTokenWithUser(req.query.token);

        if (req.user!.verifiedAt) {
            return res.status(400).json({
                message: "Error",
                errors: [
                    {
                        code: "already_verified",
                        message: "The user is already verified",
                        path: [],
                    },
                ],
            });
        }

        if (!token || token.usedAt || token.user.email !== req.user!.email) {
            return res.status(400).json({
                message: "Invalid input",
                errors: [
                    {
                        code: "invalid_verify_token",
                        message: "The verify token is invalid",
                        path: ["query", "token"],
                    },
                ],
            });
        }

        await verifyUser(token.user);
        await setVerifyTokenUsedAt(token, new Date());

        return res.status(200).json({
            message: "Successful verification",
        });
    }

    public static async resendVerify(
        req: Request,
        res: Response
    ): Promise<Response<any, Record<string, any>>> {
        if (req.user!.verifiedAt) {
            return res.status(400).json({
                message: "Error",
                errors: [
                    {
                        code: "already_verified",
                        message: "The user is already verified",
                        path: [],
                    },
                ],
            });
        }

        const expiresAt = dayjs().add(AuthController.VERIFY_TOKEN_EXPIRES_IN_DAYS, "day").toDate();
        const token = await createVerifyToken(req.user!, expiresAt);

        await defaultQueue.add(
            `verify - ${Date.now().toString()}`,
            new SendVerifyEmail({ email: req.user!.email, token: token.token })
        );

        return res.status(200).json({
            message: "Email sent",
        });
    }

    public static async passwordChange(
        req: TypedRequestBody<PasswordChangeBody>,
        res: Response
    ): Promise<Response<any, Record<string, any>>> {
        const isPasswordValid = await bcrypt.compare(req.body.currentPassword, req.user!.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid input",
                errors: [
                    {
                        code: "invalid_password",
                        message: "The password is invalid",
                        path: ["body", "currentPassword"],
                    },
                ],
            });
        }

        await setUserPassword(req.user!, req.body.newPassword);

        return res.status(200).json({
            message: "Password successfully changed",
        });
    }

    public static async sendPasswordReset(
        req: TypedRequestBody<{ email: string }>,
        res: Response
    ): Promise<Response<any, Record<string, any>>> {
        const user = await getUserByEmail(req.body.email);

        if (!user) {
            return res.status(400).json({
                message: "Invalid input",
                errors: [
                    {
                        code: "invalid_email",
                        message: "No user with that email exists",
                        path: ["body", "email"],
                    },
                ],
            });
        }

        const expiresAt = dayjs().add(AuthController.RESET_TOKEN_EXPIRES_IN_HOURS, "hour").toDate();
        const token = await createResetToken(user, expiresAt);

        await defaultQueue.add(
            `reset - ${Date.now().toString()}`,
            new SendResetEmail({ email: user.email, token: token.token })
        );

        return res.status(200).json({
            message: "Email sent",
        });
    }

    public static async passwordReset(
        req: TypedRequestQueryBody<PasswordResetQuery, PasswordResetBody>,
        res: Response
    ): Promise<Response<any, Record<string, any>>> {
        const token = await getResetTokenWithUser(req.query.token);

        if (!token || token.usedAt) {
            return res.status(400).json({
                message: "Invalid input",
                errors: [
                    {
                        code: "invalid_reset_token",
                        message: "The reset token is invalid",
                        path: ["query", "token"],
                    },
                ],
            });
        }

        await setUserPassword(token.user, req.body.password);

        await Promise.all([
            setResetTokenUsedAt(token, new Date()),
            deleteAccessTokensOfUser(token.user),
            deleteRefreshTokensOfUser(token.user),
        ]);

        return res.status(200).json({
            message: "Password successfully reset",
        });
    }
}
