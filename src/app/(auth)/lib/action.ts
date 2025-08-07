'use server';
import { signIn } from '@/lib/auth';
import { hashSync } from 'bcrypt-ts';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { CustomError } from '@/lib/auth.config';
import { loginSchema, registerSchema } from '@/lib/zod';

/**
 * Handle user sign-in using Credential Provider.
 *
 * - Validates input using Zod Schema (`loginSchema`)
 * - Attempts to sign-in with `signIn` from NextAuth
 * - Redirects to `/user` if successfull
 * - Returns error messages if validation or authentication fails
 *
 * @param _ - Unused Placeholder (Next.js Server Action first parameter)
 * @param formData - FormData object from the login form
 * @returns Object with error or message if sign-in fails, otherwise redirects
 */

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

/**
 * Handle user registration with custom logic (not via NextAuth).
 *
 * - Validates input using Zod schema (`registerSchema`)
 * - Checks if email is already registered
 * - Hashes the password using bcrypt
 * - Creates a new user in the database
 * - Redirects to `/login` after successful registration
 *
 * @param _ - Unused placeholder (Next.js Server Action first parameter)
 * @param formData - FormData object from the registration form
 * @returns Object with error or message if registration fails, otherwise redirects
 */

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
