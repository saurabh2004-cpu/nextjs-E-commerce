import { z } from "zod";

export const usernameValidation = z
.string()
.min(2,"Username must be atleast 2 characters")
.max(20,"Username must be under 20 characters")
.regex( /^[a-zA-Z0-9_-]+$/ ,"Username must not contain special charater")


export  const signUpSchema=z.object({
    username:usernameValidation,
    fullname:z.string(),
    email:z.string().email({message:"Invalid email address"}),
    phone:z
    .string()
    .min(10,"Phone number must be 10 digits")
    .max(10,"Phone number must not be 10 digits")
})

