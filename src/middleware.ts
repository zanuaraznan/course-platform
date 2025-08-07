import NextAuth from 'next-auth';
import authConfig from './lib/auth.config';

export const { auth: middleware } = NextAuth(authConfig);

export const matcher = [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpeg|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
];
