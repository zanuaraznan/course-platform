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
             *
             * - If the user is **not logged in** and tries to access a protected route (`/user`), they will be redirected to the homepage (`/`).
             * - If the user **is logged in** and tries to access a public route like `/login`, they will be redirected to `/user`.
             * - If none of the above conditions are met, access is allowed and the request proceeds as normal.
             *
             * @returns {true | NextResponse} Returns `true` to allow access to the route, or a `NextResponse.redirect` to handle redirection.
             */
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
