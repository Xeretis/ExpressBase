import { AuthController } from "../controllers/authController";
import { Router } from "express";
import { Routes } from "../../classes/routes";
import { auth } from "../middlewares/authMiddleware";
import { loginSchema } from "../../contexts/auth/schemas/LoginSchema";
import { passwordChangeSchema } from "../../contexts/auth/schemas/PasswordChangeSchema";
import { passwordResetSchema } from "../../contexts/auth/schemas/PasswordResetSchema";
import { rateLimit } from "../middlewares/rateLimitMiddleware";
import { registerSchema } from "../../contexts/auth/schemas/RegisterSchema";
import { sendPasswordResetSchema } from "../../contexts/auth/schemas/SendPasswordResetSchema";
import { validate } from "../middlewares/validateMiddleware";
import { verifySchema } from "../../contexts/auth/schemas/VerifySchema";

export class AuthRoutes implements Routes {
    public router: Router;
    public basePath?: string = "/auth";

    constructor() {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post("/login", validate(loginSchema), AuthController.login);
        this.router.get("/refresh", AuthController.refresh);
        this.router.delete("/logout", auth(), AuthController.logout);
        this.router.post(
            "/register",
            rateLimit(15 * 60 * 1000, 15),
            validate(registerSchema),
            AuthController.register
        );
        this.router.post(
            "/verify",
            rateLimit(15 * 60 * 1000, 15),
            auth(),
            validate(verifySchema),
            AuthController.verify
        );
        this.router.post(
            "/verify/resend",
            rateLimit(15 * 60 * 1000, 15),
            auth(),
            AuthController.resendVerify
        );
        this.router.post(
            "/password/change",
            auth(),
            rateLimit(15 * 60 * 1000, 15),
            validate(passwordChangeSchema),
            AuthController.passwordChange
        );
        this.router.post(
            "/password/reset",
            rateLimit(15 * 60 * 1000, 15),
            validate(passwordResetSchema),
            AuthController.passwordReset
        );
        this.router.post(
            "/password/reset/send",
            rateLimit(15 * 60 * 1000, 15),
            validate(sendPasswordResetSchema),
            AuthController.sendPasswordReset
        );
    }
}
