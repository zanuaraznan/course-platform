import { InputHTMLAttributes } from 'react';

type FormInputProps = {
    error?: string | null;
    onFocus?: () => void;
} & Pick<
    InputHTMLAttributes<HTMLInputElement>,
    'name' | 'type' | 'placeholder' | 'autoComplete'
>;

export default function FormInput({
    name,
    type,
    placeholder,
    autoComplete,
    error,
    onFocus,
}: FormInputProps) {
    return (
        <>
            <input
                name={name}
                type={type}
                placeholder={placeholder}
                autoComplete={autoComplete}
                onFocus={onFocus}
                className='placeholder:capitalize p-4 rounded-full ring ring-zinc-200 transition-colors focus:ring-2 focus:ring-indigo-400'
            />
            {error && <p className='text-left text-red-500 text-sm'>{error}</p>}
        </>
    );
}
