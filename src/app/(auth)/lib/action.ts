'use server';
import { redirect } from 'next/navigation';
import { signIn } from '../../../lib/auth';
import { CustomError } from '../../../lib/auth.config';
import { loginSchema, registerSchema } from '../../../lib/zod';
import { prisma } from '../../../lib/prisma';
import { hashSync } from 'bcrypt-ts';

async function signInCredentials(_: unknown, formData: FormData) {
    let redirectPath: string | null = null;
    const validatedFields = loginSchema.safeParse(Object.fromEntries(formData));

    if (!validatedFields.success)
        return { error: validatedFields.error.flatten().fieldErrors };

    try {
        await signIn('credentials', { ...validatedFields.data, redirect: false });
        redirectPath = '/user';
    } catch (error: unknown) {
        redirectPath = null;
        if (error instanceof CustomError) return { message: error.message };
    } finally {
        if (redirectPath) redirect(redirectPath);
    }
}

async function signUpCredentials(_: unknown, formData: FormData) {
    let redirectPath: string | null = null;

    const validatedFields = registerSchema.safeParse(Object.fromEntries(formData));

    if (!validatedFields.success)
        return { error: validatedFields.error.flatten().fieldErrors };

    const { name, email, password } = validatedFields.data;

    const user = await prisma.user.findUnique({ where: { email } });

    if (user) return { message: 'Email sudah digunakan' };

    const passwordHash = hashSync(password, 6);

    try {
        await prisma.user.create({
            data: {
                name,
                email,
                password: passwordHash,
            },
        });
        redirectPath = '/login';
    } catch (err) {
        redirectPath = null;
        if (err instanceof Error) {
            return { message: 'Gagal membuat akun :' + err.message };
        }

        return { message: 'Gagal membuat akun : unknown error' };
    } finally {
        if (redirectPath) redirect(redirectPath);
    }
}

export { signInCredentials, signUpCredentials };
