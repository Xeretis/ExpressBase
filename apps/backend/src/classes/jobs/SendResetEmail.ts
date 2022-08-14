import { BaseJob, JobImpl } from "../jobDefinitions";

import { AuthController } from "../../web/controllers/authController";
import { Job } from "bullmq";
import { logger } from "../../utils/logger";
import { transporter } from "../../utils/email";

interface SendResetEmailPayload {
    email: string;
    token: string;
}

export class SendResetEmail extends BaseJob implements JobImpl {
    constructor(public readonly payload: SendResetEmailPayload) {
        super();
    }

    public async handle(job?: Job): Promise<void> {
        const { email, token } = this.payload;

        await transporter.sendMail({
            from: `${process.env.APP_NAME} <${process.env.MAIL_USER}>`,
            to: email,
            subject: "Reset password",
            html: `
                <h1>Reset password</h1>
                <p>Click <a href="${
                    process.env.APP_BASE_URL + "/reset-password?token=" + token
                }">here</a> to reset your password.</p>
                <p>The link is valid for ${AuthController.RESET_TOKEN_EXPIRES_IN_HOURS} hour(s).</p>
            `,
        });
    }

    public async failed(job: Job): Promise<void> {
        logger.error(
            `Failed to send reset email to: ${this.payload.email} with token: ${this.payload.token}`
        );
    }
}
