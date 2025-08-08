'use client';
import Button from '@/components/ui/Button';
import GoogleIcon from '@/components/ui/GoogleIcon';
import { signIn } from 'next-auth/react';
import { FaGithub } from 'react-icons/fa6';

export default function SignInProviders() {
    return (
        <div className='flex flex-col space-y-4'>
            {['Google', 'Github'].map((provider) => {
                const Icon = provider === 'Google' ? GoogleIcon : FaGithub;

                return (
                    <Button
                        variants={{ variant: 'outline', size: 'lg', rounded: 'full' }}
                        key={provider}
                        onClick={() => {
                            if (provider === 'Google') {
                                signIn('google', { redirectTo: '/' });
                            } else {
                                signIn('github', { redirectTo: '/' });
                            }
                        }}
                        className='flex flex-center gap-2'>
                        <Icon size={18} /> Continue with {provider}
                    </Button>
                );
            })}
        </div>
    );
}
