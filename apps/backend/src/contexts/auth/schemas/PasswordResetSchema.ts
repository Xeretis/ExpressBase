import { z } from "zod";

export const passwordResetSchema = z.object({
    query: z.object({
        token: z.string({ required_error: "The token field is required" }),
    }),
    body: z.object({
        password: z.string({ required_error: "The password field is required" }).min(8, {
            message: "The password must be at least 8 characters long",
        }),
    }),
});
