'use client';
import { User } from 'next-auth';
import { cn } from '@/utils/classNames';
import { MdLogout } from 'react-icons/md';
import { ModalProvider, useModalContext } from '@/hooks/context';
import { SessionProvider, signOut, useSession } from 'next-auth/react';

export default function UserButton() {
    return (
        <SessionProvider>
            <ModalProvider>
                <UserProfile />
            </ModalProvider>
        </SessionProvider>
    );
}

function UserProfile() {
    const { data, status } = useSession();
    const { openModal, isOpen } = useModalContext();

    if (status === 'loading') {
        return <div className='size-10 rounded-full bg-skeleton-loading' />;
    }

    if (!data) return null;

    const session = data.user;

    return (
        <>
            <button
                onClick={openModal}
                className={cn(
                    'shrink-0 onclick-opacity rounded-full size-10 overflow-hidden transition-[box-shadow]',
                    isOpen && 'ring-3 ring-slate-300'
                )}>
                <img
                    src={session.image ?? '/assets/profile.png'}
                    width={100}
                    height={100}
                    alt='Profile image'
                    className='object-cover'
                />
            </button>
            <UserModal {...session} />
        </>
    );
}

function UserModal({ ...props }: User) {
    const { modalRef, isOpen, isAnimate } = useModalContext();

    if (!isOpen) return null;

    return (
        <div
            ref={modalRef}
            className={cn(
                'bg-white rounded-2xl shadow-2xl shadow-black/8 max-w-1/2 absolute right-4 top-[calc(100%_+16px)] transition-all origin-top duration-100 divide-y divide-neutral-200 *:flex *:items-center *:gap-4 *:text-sm *:font-medium *:p-6 *:w-full',
                !isAnimate && '-translate-y-4 opacity-0'
            )}>
            <div className='flex items-center gap-4'>
                <img
                    src={props.image ?? '/assets/profile.png'}
                    width={100}
                    height={100}
                    alt='Profile image'
                    className='rounded-full size-10'
                />
                <p>{props.name}</p>
            </div>
            <button onClick={() => signOut()} className='text-red-500 onclick-opacity'>
                <div className='px-3'>
                    <MdLogout size={18} aria-hidden />
                </div>
                Log out
            </button>
        </div>
    );
}
