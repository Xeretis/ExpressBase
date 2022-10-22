import { z } from "zod";

export const loginSchema = z.object({
    body: z.object({
        email: z.string({ required_error: "The email field is required" }),
        password: z.string({ required_error: "The password field is required" }),
        remember: z.boolean({ required_error: "The remember field is required" }),
    }),
});
