import Link from 'next/link';
import UserButton from './UserButton';
import Button from '@/components/ui/Button';
import { auth } from '@/lib/auth';

const navList: Record<string, string> = {
    courses: 'My Courses',
    purchases: 'Purchases history',
};

function ConsumerNavList() {
    return Object.entries(navList).map(([key, value]) => (
        <button key={key} className='onclick-opacity p-2 font-medium'>
            <Link href={`/${key}`}>{value}</Link>
        </button>
    ));
}

export default async function Navbar() {
    const session = await auth();

    return (
        <header className='w-full sticky z-999 p-4 bg-white'>
            <nav className='container flex flex-center justify-between'>
                <Link href='/' className='font-semibold text-lg hover-opacity'>
                    <span className='text-slate-600'>Course</span> Platform
                </Link>
                {session ? (
                    <ul className='flex items-center gap-4'>
                        <ConsumerNavList />
                        <UserButton />
                    </ul>
                ) : (
                    <Link href='/login'>
                        <Button type='submit' variants={{ size: 'sm' }}>
                            Sign in
                        </Button>
                    </Link>
                )}
            </nav>
        </header>
    );
}
