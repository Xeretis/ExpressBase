import { z } from "zod";

export const passwordChangeSchema = z.object({
    body: z
        .object({
            currentPassword: z.string({ required_error: "The current password field is required" }),
            newPassword: z.string({ required_error: "The new password field is required" }).min(8, {
                message: "The new password must be at least 8 characters long",
            }),
            newPasswordConfirmation: z.string({
                required_error: "The new password confirmation field is required",
            }),
        })
        .refine((data) => data.currentPassword !== data.newPassword, {
            message: "The new and current password must be different",
            path: ["newPassword"],
        })
        .refine((data) => data.newPassword === data.newPasswordConfirmation, {
            message: "The new password confirmation does not match the new password",
            path: ["newPasswordConfirmation"],
        }),
});
