type AuthInputProps = {
    name: string;
    placeholder?: string;
    autoComplete?: string;
    error?: string | null;
    onFocus?: () => void;
};

export default function AuthInput({
    name,
    placeholder,
    autoComplete,
    error,
    onFocus,
}: AuthInputProps) {
    return (
        <>
            <input
                name={name}
                type={name}
                placeholder={placeholder}
                autoComplete={autoComplete}
                onFocus={onFocus}
                className='p-4 rounded-full ring ring-zinc-200 transition-colors focus:ring-2 focus:ring-indigo-400'
            />
            {error && <p className='text-left text-red-500 text-sm'>{error}</p>}
        </>
    );
}
