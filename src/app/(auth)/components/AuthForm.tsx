'use client';

import AuthInput from './AuthInput';
import Button from '@/components/ui/Button';
import { useActionState, useState, useEffect, InputHTMLAttributes } from 'react';

type ActionForm = (...args: any) => Promise<any>;

type Placeholder<T extends ActionForm> = Partial<
    Record<keyof Extract<Awaited<ReturnType<T>>, { error: object }>['error'], string>
>;

type FormError<T extends ActionForm> = {
    key: keyof Placeholder<T> | null;
    message: string | null | undefined;
};

type AuthFormProps<T extends ActionForm = ActionForm> = {
    placeholder: Placeholder<T>;
    autoComplete: Record<
        keyof Placeholder<T>,
        InputHTMLAttributes<HTMLInputElement>['autoComplete']
    >;
    formAction: T;
};

/**
 * Reusable authentication form component.
 *
 * - Receives dynamic input fields based on `placeholder` keys
 * - Handles form state via `useActionState`
 * - Displays server-side errors and validation messages
 *
 * @template T - A function type representing the server action (sign in / sign up)
 * @param formAction - The server action to handle form submission
 * @param placeholder - Object containing placeholder strings for each input field
 * @param autoComplete - Object defining the autocomplete attributes for each input
 */

export default function AuthForm<T extends ActionForm>({
    formAction,
    placeholder,
    autoComplete,
}: AuthFormProps<T>) {
    const [formState, action, pending] = useActionState(formAction, null);

    const keys = Object.keys(placeholder) as string[];

    const [error, setError] = useState<FormError<T> | null>(null);

    useEffect(
        function handleFieldErrorFromState() {
            if (!formState || !formState.error) return setError(null);

            const firstKey = Object.keys(formState.error)[0] as keyof Placeholder<T>;

            const firstMessage = formState.error[firstKey]?.[0];
            setError({ key: firstKey, message: firstMessage });
        },
        [formState]
    );

    return (
        <form action={action} noValidate className='*:w-full space-y-3 mt-4'>
            {formState && formState.message && (
                <p className='text-red-500 text-sm'>{formState.message}</p>
            )}
            {keys.map((input) => (
                <AuthInput
                    key={input}
                    name={input}
                    placeholder={placeholder[input]}
                    autoComplete={autoComplete[input]}
                    error={input === error?.key ? error.message : null}
                    onFocus={() => setError(null)}
                />
            ))}
            <Button
                variants={{ size: 'lg', rounded: 'full' }}
                type='submit'
                disabled={pending}
                className='mt-3'>
                Continue
            </Button>
        </form>
    );
}
