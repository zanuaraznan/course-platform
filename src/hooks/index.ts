import { auth } from '@/lib/auth';
import { notFound } from 'next/navigation';

async function useSession() {
    const session = await auth();

    if (!session) notFound();

    return session;
}

export { useSession };
