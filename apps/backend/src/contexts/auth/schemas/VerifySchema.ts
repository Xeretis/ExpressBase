import { z } from "zod";

export const verifySchema = z.object({
    query: z.object({
        token: z.string({ required_error: "The token field is required" }),
    }),
});
