import Button from '@/components/ui/Button';
import PageHeader from '@/components/ui/PageHeader';
import Link from 'next/link';

export default function Page() {
    return (
        <section className='container'>
            <PageHeader title='Courses' className='flex items-center justify-between'>
                <Link href='courses/new'>
                    <Button>New courses</Button>
                </Link>
            </PageHeader>
        </section>
    );
}
