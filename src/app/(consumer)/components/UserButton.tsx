'use client';
import { ModalProvider, useModalContext } from '@/hooks/context';
import { SessionProvider, useSession } from 'next-auth/react';
import { cn } from '@/utils/classNames';

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
    const { data } = useSession();
    const { openModal } = useModalContext();
    if (!data) return null;

    const session = data.user;

    return (
        <>
            <button
                onClick={openModal}
                className='onclick-opacity rounded-full size-10 overflow-hidden'>
                <img
                    src={session.image ?? '/assets/profile.png'}
                    width={100}
                    height={100}
                    alt='Profile image'
                />
            </button>
            <UserModal />
        </>
    );
}

function UserModal() {
    const { modalRef, isOpen, isAnimate } = useModalContext();

    if (!isOpen) return null;

    return (
        <div
            ref={modalRef}
            className={cn(
                'bg-white rounded-2xl shadow-xl shadow-black/8 p-8 max-w-1/2 absolute right-4 top-[calc(100%_+16px)] transition-all origin-top',
                !isAnimate && 'scale-50 opacity-0'
            )}>
            user modal
        </div>
    );
}
