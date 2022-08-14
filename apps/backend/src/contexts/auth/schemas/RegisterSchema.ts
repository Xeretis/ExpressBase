import { z } from "zod";

export const registerSchema = z.object({
    body: z
        .object({
            email: z
                .string({ required_error: "The email field is required" })
                .email({ message: "The given email is invalid" }),
            username: z.string({
                required_error: "The username field is required",
            }),
            password: z.string({ required_error: "The password field is required" }).min(8, {
                message: "The password must be at least 8 characters long",
            }),
            passwordConfirmation: z.string({
                required_error: "The password confirmation field is required",
            }),
        })
        .refine((data) => data.password === data.passwordConfirmation, {
            message: "The password confirmation does not match the password",
            path: ["passwordConfirmation"],
        }),
});
