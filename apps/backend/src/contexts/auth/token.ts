import { AccessToken, GeneralToken, GeneralTokenContext, RefreshToken, User } from "@prisma/client";
import {
    AccessTokenWithUser,
    GeneralTokenWithUser,
    RefreshTokenWithUser,
} from "../../classes/partialModels";

import { HttpException } from "../../exceptions/httpException";
import crypto from "crypto";
import { prisma } from "../../utils/prisma";

//* ----------------
//* For registration
//* ----------------

export const createVerifyToken = async (user: User, expiresAt: Date): Promise<GeneralToken> => {
    const token = crypto.randomBytes(64).toString("hex");

    try {
        return await prisma.generalToken.create({
            data: {
                token,
                context: GeneralTokenContext.VERIFY_EMAIL,
                userId: user.id,
                expiresAt,
            },
        });
    } catch (err) {
        throw new HttpException(500, "Error while creating verify token");
    }
};

export const getVerifyTokenWithUser = async (
    token: string
): Promise<GeneralTokenWithUser | undefined> => {
    const verifyTokenWithUser = await prisma.generalToken.findFirst({
        where: {
            token,
            context: GeneralTokenContext.VERIFY_EMAIL,
            expiresAt: {
                gte: new Date(),
            },
        },
        include: {
            user: true,
        },
    });

    return verifyTokenWithUser || undefined;
};

export const setVerifyTokenUsedAt = async (
    verifyToken: GeneralToken,
    usedAt: Date
): Promise<void> => {
    await prisma.generalToken.update({
        where: {
            id: verifyToken.id,
        },
        data: {
            usedAt: usedAt,
        },
    });
};

//* --------------------
//* For login and logout
//* --------------------

export const createAuthTokens = async (
    user: User,
    accessExpiresAt: Date,
    refreshExpiresAt: Date,
    parentTokenId?: number
): Promise<{ accessToken: string; refreshToken: string }> => {
    const accessToken = crypto.randomBytes(64).toString("hex");
    const refreshToken = crypto.randomBytes(64).toString("hex");

    try {
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                parentTokenId: parentTokenId,
                expiresAt: refreshExpiresAt,
            },
        });

        await prisma.accessToken.create({
            data: {
                token: accessToken,
                userId: user.id,
                expiresAt: accessExpiresAt,
            },
        });

        return { accessToken, refreshToken };
    } catch (err) {
        throw new HttpException(500, "Error while creating auth tokens");
    }
};

export const getRefreshTokenWithUser = async (
    refreshToken: string
): Promise<RefreshTokenWithUser | undefined> => {
    const refreshTokenWithUser = await prisma.refreshToken.findFirst({
        where: {
            token: refreshToken,
            expiresAt: {
                gte: new Date(),
            },
        },
        include: {
            user: true,
        },
    });

    return refreshTokenWithUser || undefined;
};

export const deleteRefreshToken = async (refreshToken: RefreshToken): Promise<void> => {
    await prisma.refreshToken.delete({
        where: {
            id: refreshToken.id,
        },
    });
};

export const setRefreshTokenUsedAt = async (
    refreshToken: RefreshToken,
    usedAt: Date
): Promise<void> => {
    await prisma.refreshToken.update({
        where: {
            id: refreshToken.id,
        },
        data: {
            usedAt: usedAt,
        },
    });
};

export const deleteAccessToken = async (token: AccessToken): Promise<void> => {
    await prisma.accessToken.delete({
        where: {
            id: token.id,
        },
    });
};

//* -----------------
//* For authorization
//* -----------------

export const getAccessTokenWithUser = async (
    accessToken: string
): Promise<AccessTokenWithUser | undefined> => {
    const token = await prisma.accessToken.findFirst({
        where: {
            token: accessToken,
            expiresAt: {
                gte: new Date(),
            },
        },
        include: {
            user: true,
        },
    });

    return token || undefined;
};

//* ------------------
//* For password reset
//* ------------------

export const createResetToken = async (user: User, expiresAt: Date): Promise<GeneralToken> => {
    const token = crypto.randomBytes(64).toString("hex");

    try {
        return await prisma.generalToken.create({
            data: {
                token,
                context: GeneralTokenContext.RESET_PASSWORD,
                userId: user.id,
                expiresAt,
            },
        });
    } catch (err) {
        throw new HttpException(500, "Error while creating reset token");
    }
};

export const getResetTokenWithUser = async (
    token: string
): Promise<GeneralTokenWithUser | undefined> => {
    const resetTokenWithUser = await prisma.generalToken.findFirst({
        where: {
            token,
            context: GeneralTokenContext.RESET_PASSWORD,
            expiresAt: {
                gte: new Date(),
            },
        },
        include: {
            user: true,
        },
    });

    return resetTokenWithUser || undefined;
};

export const setResetTokenUsedAt = async (
    resetToken: GeneralToken,
    usedAt: Date
): Promise<void> => {
    await prisma.generalToken.update({
        where: {
            id: resetToken.id,
        },
        data: {
            usedAt: usedAt,
        },
    });
};

export const deleteAccessTokensOfUser = async (user: User): Promise<void> => {
    await prisma.accessToken.deleteMany({
        where: {
            userId: user.id,
        },
    });
};

export const deleteRefreshTokensOfUser = async (user: User): Promise<void> => {
    await prisma.refreshToken.deleteMany({
        where: {
            userId: user.id,
        },
    });
};
