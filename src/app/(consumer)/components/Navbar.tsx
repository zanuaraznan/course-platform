import Button from '@/components/ui/Button';
import { auth } from '@/lib/auth';
import Link from 'next/link';

export default async function Navbar() {
    const session = await auth();

    return (
        <header className='w-full sticky z-999 p-4 bg-white'>
            <nav className='container flex flex-center justify-between'>
                <Link href='/' className='font-semibold text-lg hover-opacity'>
                    Course Platform
                </Link>
                {session ? null : (
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
