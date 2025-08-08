import Link from 'next/link';
import { auth } from '@/lib/auth';
import Button from '@/components/ui/Button';
import UserButton from '@consumer/components/UserButton';

const navList: Record<string, string> = {
    courses: 'Courses',
    products: 'Products',
    sales: 'Sales',
};

function ConsumerNavList() {
    return Object.entries(navList).map(([key, value]) => (
        <button key={key} className='onclick-opacity p-2 font-medium'>
            <Link href={`/admin/${key}`}>{value}</Link>
        </button>
    ));
}

export default async function Navbar() {
    const session = await auth();

    return (
        <header className='w-full sticky z-999 p-4 px-6 bg-white'>
            <nav className='flex flex-center justify-between'>
                <Link
                    href='/'
                    className='font-semibold text-lg hover-opacity flex items-center gap-4'>
                    <p>
                        <span className='text-slate-600'>Course</span> Platform
                    </p>
                    <span className='p-1 px-2 text-xs bg-slate-500 rounded-md text-white font-normal'>
                        Admin
                    </span>
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
