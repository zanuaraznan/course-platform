import { accessAdminPages, getCurrentUser } from '@/utils/session';
import Link from 'next/link';

export default async function AdminLink() {
    const user = await getCurrentUser();

    if (!accessAdminPages(user)) return null;

    return (
        <Link href='/admin/dashboard' className='font-medium p-2 onclick-opacity'>
            Admin
        </Link>
    );
}
