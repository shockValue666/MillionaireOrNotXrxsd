import { z } from "zod";

export const BiggerOrSmallerSchema = z.object(
    {
        amount:z.string().describe("amount"),
    }
)

export const LoginSchema = z.object(
    {
        email:z.string().describe("Email").email({message:"Invalid Emaillllll"}),
        password:z.string().describe("Password").min(1,'Password is required')
    }
)


export const SignupFormSchema = z.object({
    email:z.string().describe('Email').email({message:"Invaddid email"}),
    password:z.string().describe("Password").min(6,"PASSWORD mus have something"),
    confirmPassword:z.string().describe("Confirm Password").min(6,"password mus")
}).refine((data)=>data.password===data.confirmPassword,{
    message:"Password don't match",
    path:['confirmPassword']
})
