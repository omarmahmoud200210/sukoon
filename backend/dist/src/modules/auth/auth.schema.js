import { z } from "zod";
const LoginSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(8),
        rememberMe: z.boolean().optional(),
    }),
});
const RegisterSchema = z.object({
    body: z.object({
        firstName: z.string().min(3),
        lastName: z.string().min(3),
        email: z.string().email(),
        password: z.string().min(8),
    }),
});
const ForgotPasswordSchema = z.object({
    body: z.object({
        email: z.string().email(),
    }),
});
const ResetPasswordSchema = z.object({
    body: z.object({
        password: z.string().min(8),
    }),
});
const ChangeFirstNameAndLastNameSchema = z.object({
    body: z.object({
        firstName: z.string().min(3),
        lastName: z.string().min(3),
    }),
});
const ChangePasswordSchema = z.object({
    body: z.object({
        password: z.string().min(8),
    }),
});
export { LoginSchema, RegisterSchema, ForgotPasswordSchema, ResetPasswordSchema, ChangeFirstNameAndLastNameSchema, ChangePasswordSchema, };
