import z from 'zod/v3';

const EmailSchema = z.string().nonempty('Email cannot be empty').email('Invalid email');
const PasswordSchema = z.string().nonempty('Password cannot be empty');

const loginSchema = z.object({
    email: EmailSchema,
    password: PasswordSchema,
});

const registerSchema = z.object({
    name: z
        .string()
        .nonempty('Username cannot be empty')
        .max(50, 'Username length exceeds 50 characters'),
    email: EmailSchema,
    password: PasswordSchema.max(20, 'Password length exceeds 20 characters'),
});

export { loginSchema, registerSchema };
