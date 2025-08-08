import { AuthError, NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { NextResponse } from 'next/server';
import { loginSchema } from './zod';
import { prisma } from './prisma';
import { compareSync } from 'bcrypt-ts';

/**
 * Custom error class for handling authentication-specific errors
 * with custom messages in credential-based login.
 */

export class CustomError extends AuthError {
    constructor(message: string) {
        super();
        this.message = message;
    }
}

/**
 * NextAuth configuration object containing:
 *
 * - Pages: Custom route for login
 * - Providers: Google, GitHub, and custom credentials-based authentication
 * - Callbacks:
 *   - `authorized`: Middleware-like access control per route
 *   - `jwt`: Add custom fields (e.g., role) to JWT token
 *   - `session`: Attach token data to the session object
 */

export default {
    pages: {
        signIn: '/login',
        signOut: '/logout',
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
                /**
                 * Handles credential-based authentication.
                 *
                 * - Validates input using Zod schema
                 * - Finds user in database by email
                 * - Compares hashed password
                 * - Returns user if valid, otherwise throws CustomError
                 */
                const validatedFields = loginSchema.safeParse(credentials);

                if (!validatedFields.success) return null;
                const { email, password } = validatedFields.data;

                const user = await prisma.user.findUnique({
                    where: { email },
                });

                if (!user || !user.password)
                    throw new CustomError('Incorrect email or password');

                const isPasswordMatch = compareSync(password, user.password);

                if (!isPasswordMatch)
                    throw new CustomError('Incorrect email or password');

                return user;
            },
        }),
    ],
    callbacks: {
        authorized: async ({ request, auth }) => {
            /**
             * Handles route protection and redirection based on user authentication.
             * @returns {true | NextResponse} Returns `true` to allow access to the route, or a `NextResponse.redirect` to handle redirection.
             */
            const isAdmin = auth?.user.role === 'ADMIN';
            const isLoggedIn = !!auth?.user;
            const pathname = request.nextUrl.pathname;
            const authRoutes = ['/register', '/login'];

            function redirect(path: string) {
                return NextResponse.redirect(new URL(path, request.url));
            }

            // 1. Admin routes protection
            if (pathname.startsWith('/admin')) {
                if (!isAdmin) return redirect('/');
                if (pathname === '/admin') return redirect('/admin/dashboard');
                return true;
            }

            // 2. Login page access
            if (isLoggedIn && authRoutes.includes(pathname)) {
                return isAdmin ? redirect('/admin/dashboard') : redirect('/');
            }

            // 3. Default allow
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
