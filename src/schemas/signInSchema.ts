import { z } from "zod";

export const signInSchema=z.object({
    phone:z
    .string()
    .min(10,"Phone number must be 10 digits")
    .max(10,"Phone number must not be 10 digits")
})