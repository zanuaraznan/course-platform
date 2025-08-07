import { AuthError, NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { NextResponse } from 'next/server';
import { loginSchema } from './zod';
import { prisma } from './prisma';
import { compareSync } from 'bcrypt-ts';

export class CustomError extends AuthError {
    constructor(message: string) {
        super();
        this.message = message;
    }
}

export default {
    pages: {
        signIn: '/login',
    },
    providers: [
        Google({ allowDangerousEmailAccountLinking: true }),
        GitHub({ allowDangerousEmailAccountLinking: true }),
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                const validatedFields = loginSchema.safeParse(credentials);

                if (!validatedFields.success) return null;
                const { email, password } = validatedFields.data;

                const user = await prisma.user.findUnique({
                    where: { email },
                });

                if (!user || !user.password)
                    throw new CustomError('Email atau password salah');

                const isPasswordMatch = compareSync(password, user.password);

                if (!isPasswordMatch) throw new CustomError('Email atau password salah');

                return user;
            },
        }),
    ],
    callbacks: {
        authorized: async ({ request, auth }) => {
            const isLoggedIn = !!auth?.user;
            const pathname = request.nextUrl.pathname;

            if (!isLoggedIn && pathname.startsWith('/user')) {
                return NextResponse.redirect(new URL('/', request.url));
            }

            if (isLoggedIn && pathname.startsWith('/login')) {
                return NextResponse.redirect(new URL('/user', request.url));
            }

            return true;
        },
        jwt({ token, user }) {
            if (user) {
                token.role = user.role;
            }
            return token;
        },
        session({ session, token }) {
            session.user.id = token.sub;
            session.user.role = token.role;
            return session;
        },
    },
} satisfies NextAuthConfig;
