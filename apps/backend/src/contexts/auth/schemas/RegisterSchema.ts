import { z } from "zod";

export const registerSchema = z.object({
    body: z
        .object({
            email: z
                .string({ required_error: "Az email mező kötelező" })
                .email({ message: "A megadott email nem megfelelő" }),
            username: z.string({
                required_error: "A felhasználónév mező kötelező",
            }),
            password: z.string({ required_error: "A jelszó mező kötelező" }).min(8, {
                message: "A jelszónak minimum 8 karakterből kell állnia",
            }),
            passwordConfirmation: z.string({
                required_error: "A jelszó megerősítése mező kötelező",
            }),
        })
        .refine((data) => data.password === data.passwordConfirmation, {
            message: "A megadott jelszavak nem egyeznek",
            path: ["passwordConfirmation"],
        }),
});
