'use client';
import {
    createContext,
    ReactNode,
    RefObject,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';

type ModalContextType = {
    isOpen: boolean;
    isAnimate: boolean;
    openModal(): void;
    closeModal(): void;
    modalRef: RefObject<HTMLDivElement | null> | null;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

function ModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setOpen] = useState(false);
    const [isAnimate, setAnimate] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    function openModal() {
        setOpen(true);
        setTimeout(() => setAnimate(true), 10);
    }

    function closeModal() {
        setAnimate(false);
        setTimeout(() => setOpen(false), 300);
    }

    function handleClickOutside(e: MouseEvent) {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
            closeModal();
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && modalRef.current) modalRef.current.focus();
    }, [isOpen, modalRef]);

    return (
        <ModalContext.Provider
            value={{ isOpen, isAnimate, modalRef, openModal, closeModal }}>
            {children}
        </ModalContext.Provider>
    );
}

function useModalContext() {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModalContext must be used within an ModalContext');
    }
    return context;
}

export { ModalProvider, useModalContext };
