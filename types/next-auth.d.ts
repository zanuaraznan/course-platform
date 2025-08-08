import { JWT } from 'next-auth/jwt';
import { UserRole } from '@prisma/client';
import { type DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: User & DefaultSession['user'];
    }
    interface User {
        role: UserRole;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        sub: string;
        role: UserRole;
    }
}
