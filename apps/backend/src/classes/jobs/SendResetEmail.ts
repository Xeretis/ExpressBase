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
            subject: "Jelszó megváltoztatása",
            html: `
                <h1>Jelszó megváltoztatása</h1>
                <p>Kattints <a href="${
                    process.env.APP_BASE_URL + "/reset-password?token=" + token
                }">ide</a> a jelszavad megváltoztatásához.</p>
                <p>A link még ${AuthController.RESET_TOKEN_EXPIRES_IN_HOURS} óráig érvényes.</p>
            `,
        });
    }

    public async failed(job: Job): Promise<void> {
        logger.error(
            `Failed to send reset email to: ${this.payload.email} with token: ${this.payload.token}`
        );
    }
}
