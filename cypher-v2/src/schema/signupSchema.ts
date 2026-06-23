import z from 'zod'

export const UsernameSchema = z.string().min(4 , "Username must be atleast 4 characters").max(8 , "Username must be atmost 8 characters").regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special characters')

export const signupSchema = z.object({
    username: UsernameSchema,
    email: z.string().email({message: "Invalid email address"}),
    password: z.string().min(6,"Password must be atleast 6 characters")
})