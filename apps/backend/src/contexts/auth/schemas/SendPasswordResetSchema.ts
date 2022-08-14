import { z } from "zod";

export const sendPasswordResetSchema = z.object({
    body: z.object({
        email: z
            .string({ required_error: "The email field is required" })
            .email({ message: "The given email is invalid" }),
    }),
});
