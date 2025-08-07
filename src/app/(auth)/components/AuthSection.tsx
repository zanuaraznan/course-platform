import Link from 'next/link';
import SignInProviders from './SignInProviders';

export default function AuthSection({
    title,
    Form,
    linkLabel,
}: {
    title: string;
    Form: React.ReactElement;
    linkLabel: string;
}) {
    const [text, label, href] = linkLabel.split(':');

    return (
        <>
            <h1 className='font-medium text-3xl'>{title}</h1>
            {Form}
            <p>
                {text + ' '}
                <Link href={href} className='text-indigo-400 hover:underline'>
                    {label}
                </Link>
            </p>
            <span className='my-4 font-semibold text-sm'>ATAU</span>
            <SignInProviders />
        </>
    );
}
