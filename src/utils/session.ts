import { auth } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import { notFound } from 'next/navigation';

async function getCurrentUser() {
    const session = await auth();

    if (!session) notFound();

    return session.user;
}

function accessAdminPages({ role }: { role: UserRole | undefined }) {
    return role === 'ADMIN';
}

export { getCurrentUser, accessAdminPages };
