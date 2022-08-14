import { z } from "zod";

export const loginSchema = z.object({
    body: z.object({
        email: z.string({ required_error: "Az email mező kötelező" }),
        password: z.string({ required_error: "A jelszó mező kötelező" }),
    }),
});
