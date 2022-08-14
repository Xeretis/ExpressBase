import { z } from "zod";

export const sendPasswordResetSchema = z.object({
    body: z.object({
        email: z
            .string({ required_error: "Az email mező kötelező" })
            .email({ message: "A megadott email nem megfelelő" }),
    }),
});
