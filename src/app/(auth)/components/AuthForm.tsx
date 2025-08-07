'use client';

import Button from '@/components/ui/Button';
import {
    useActionState,
    useState,
    useEffect,
    Fragment,
    InputHTMLAttributes,
} from 'react';

type ActionForm = (...args: any) => Promise<any>;

type Placeholder<T extends ActionForm> = Partial<
    Record<keyof Extract<Awaited<ReturnType<T>>, { error: object }>['error'], string>
>;

type AuthFormProps<T extends ActionForm = ActionForm> = {
    placeholder: Placeholder<T>;
    autoComplete: Record<
        keyof Placeholder<T>,
        InputHTMLAttributes<HTMLInputElement>['autoComplete']
    >;
    formAction: T;
};

export default function AuthForm<T extends ActionForm>({
    formAction,
    placeholder,
    autoComplete,
}: AuthFormProps<T>) {
    const [state, action, pending] = useActionState(formAction, null);

    const keys = Object.keys(placeholder) as string[];

    const [error, setError] = useState<{
        key: keyof Placeholder<T> | null;
        message: string | null | undefined;
    } | null>(null);

    useEffect(() => {
        const isError = !!(state && state.error);

        const firstKey = isError
            ? (Object.keys(state.error)[0] as keyof Placeholder<T>)
            : null;
        const firstMessage = isError && firstKey ? state.error[firstKey]?.[0] : null;
        setError({ key: firstKey, message: firstMessage });
    }, [state]);

    return (
        <form action={action} noValidate className='*:w-full space-y-3 mt-4'>
            {state && state.message && (
                <p className='text-red-500 text-sm'>{state.message}</p>
            )}
            {keys.map((input) => (
                <Fragment key={input}>
                    <input
                        type={input}
                        name={input}
                        autoComplete={autoComplete[input]}
                        placeholder={placeholder[input]}
                        onFocus={() => setError(null)}
                        className='p-4 rounded-full ring ring-zinc-200 transition-colors focus:ring-2 focus:ring-indigo-400'
                    />
                    {input === error?.key && (
                        <p className='text-left text-red-500 text-sm'>{error.message}</p>
                    )}
                </Fragment>
            ))}

            <Button
                variants={{ size: 'lg', rounded: 'full' }}
                type='submit'
                disabled={pending}
                className='mt-3'>
                Lanjutkan
            </Button>
        </form>
    );
}
