import { cn } from '@/utils/classNames';
import { cva, VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes } from 'react';

const buttonVariants = cva(
    'font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    {
        variants: {
            variant: {
                primary: 'bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-white',
                outline: 'bg-white ring ring-neutral-200 onclick-opacity',
            },
            size: {
                sm: 'p-2 px-4 text-sm',
                md: 'p-3 px-6',
                lg: 'p-5 px-7',
            },
            rounded: {
                lg: 'rounded-lg',
                full: 'rounded-full',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
            rounded: 'lg',
        },
    }
);

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variants?: ButtonVariantProps;
};

export default function Button({ variants, ...props }: ButtonProps) {
    return (
        <button
            {...props}
            className={cn(buttonVariants({ ...variants }), props.className)}>
            {props.children}
        </button>
    );
}
