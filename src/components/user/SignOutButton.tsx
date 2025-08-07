'use client';
import { signOut } from 'next-auth/react';

export default function SignOutButton() {
    return (
        <button
            onClick={() => signOut()}
            className='bg-zinc-900 text-white font-medium p-3 px-4 rounded-xl m-2 transition-colors hover:bg-zinc-800 active:bg-zinc-700'>
            Sign Out
        </button>
    );
}
