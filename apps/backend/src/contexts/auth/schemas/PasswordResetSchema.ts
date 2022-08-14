import { z } from "zod";

export const passwordResetSchema = z.object({
    query: z.object({
        token: z.string({ required_error: "A token mező kötelező" }),
    }),
    body: z.object({
        password: z.string({ required_error: "A jelszó mező kötelező" }).min(8, {
            message: "A jelszónak minimum 8 karakterből kell állnia",
        }),
    }),
});
