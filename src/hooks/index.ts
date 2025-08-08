'use client';
import { auth } from '@/lib/auth';
import { notFound } from 'next/navigation';
import { useLayoutEffect, useState } from 'react';

function useDebounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
    let timer: ReturnType<typeof setTimeout>;

    return (...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

function useBreakpoint(width = 768) {
    const [isBreak, setBreak] = useState<boolean | undefined>(undefined);

    const handleViewportResize = useDebounce(
        () => setBreak(window.innerWidth <= width),
        100
    );

    useLayoutEffect(() => {
        if (typeof window === 'undefined') return;

        handleViewportResize();

        window.addEventListener('resize', handleViewportResize);
        return () => window.removeEventListener('resize', handleViewportResize);
    }, [width]);

    return isBreak;
}

export { useDebounce, useBreakpoint };
