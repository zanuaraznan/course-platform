import z from 'zod/v3';

const EmailSchema = z
    .string()
    .nonempty('Email tidak boleh kosong')
    .email('Email tidak valid');
const PasswordSchema = z.string().nonempty('Password tidak boleh kosong');

const loginSchema = z.object({
    email: EmailSchema,
    password: PasswordSchema,
});

const registerSchema = z.object({
    name: z
        .string()
        .nonempty('Nama tidak boleh kosong')
        .max(50, 'Panjang nama melebihi 50 karakter'),
    email: EmailSchema,
    password: PasswordSchema.max(20, 'Panjang password melebihi 20 karakter'),
});

export { loginSchema, registerSchema };
