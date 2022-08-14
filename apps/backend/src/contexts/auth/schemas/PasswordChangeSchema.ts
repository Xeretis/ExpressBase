import { z } from "zod";

export const passwordChangeSchema = z.object({
    body: z
        .object({
            currentPassword: z.string({ required_error: "A jelenlegi jelszó mező kötelező" }),
            newPassword: z.string({ required_error: "Az új jelszó mező kötelező" }).min(8, {
                message: "A jelszónak minimum 8 karakterből kell állnia",
            }),
            newPasswordConfirmation: z.string({
                required_error: "Az új jelszó megerősítése mező kötelező",
            }),
        })
        .refine((data) => data.currentPassword !== data.newPassword, {
            message: "A jelenlegi és az új jelszavak egyeznek",
            path: ["newPassword"],
        })
        .refine((data) => data.newPassword === data.newPasswordConfirmation, {
            message: "A megadott új jelszavak nem egyeznek",
            path: ["newPasswordConfirmation"],
        }),
});
