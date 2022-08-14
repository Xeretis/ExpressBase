import { BaseJob, JobImpl } from "../jobDefinitions";

import { Job } from "bullmq";
import { logger } from "../../utils/logger";
import { transporter } from "../../utils/email";

interface SendConfirmEmailPayload {
    email: string;
    token: string;
}

export class SendVerifyEmail extends BaseJob implements JobImpl {
    constructor(public readonly payload: SendConfirmEmailPayload) {
        super();
    }

    public async handle(job?: Job): Promise<void> {
        const { email, token } = this.payload;

        await transporter.sendMail({
            from: `${process.env.APP_NAME} <${process.env.MAIL_USER}>`,
            to: email,
            subject: "Email cím megerősítése",
            html: `
                <h1>Email cím megerősítése</h1>
                <p>Kattintson <a href="${
                    process.env.APP_BASE_URL + "/verify?token=" + token
                }">ide</a> az email címe megerősítéséhez.</p>
                <p>Amennyiben nem tudja honnan származik ez az üzenet hagyja figyelmen kívül</p>
            `,
        });
    }

    public async failed(job: Job): Promise<void> {
        logger.error(
            `Failed to send verify email to: ${this.payload.email} with token: ${this.payload.token}`
        );
    }
}
