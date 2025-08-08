'use client';
import { cn } from '@/utils/classNames';
import {
    ComponentProps,
    createContext,
    Dispatch,
    FormHTMLAttributes,
    InputHTMLAttributes,
    ReactNode,
    SetStateAction,
    useActionState,
    useContext,
    useEffect,
    useState,
} from 'react';
import FormInput from './FormInput';
import Button from '@/components/ui/Button';

type ActionForm = (...args: any[]) => Promise<any>;

type ActionKeys<T extends ActionForm> = keyof Partial<
    Record<keyof Extract<Awaited<ReturnType<T>>, { error: object }>['error'], string>
>;

type FormError<T extends ActionForm> = {
    key: ActionKeys<T> | null;
    message: string | null | undefined;
};

type InputConfig<T extends ActionForm> = Record<
    ActionKeys<T>,
    {
        placeholder?: string;
        type?: InputHTMLAttributes<HTMLInputElement>['type'];
        autoComplete?: InputHTMLAttributes<HTMLInputElement>['autoComplete'];
    }
>;

interface FormWrapperProps<T extends ActionForm> {
    formAction: T;
    inputConfig: InputConfig<T>;
    children?: ReactNode;
}

interface FormContextType<T extends ActionForm> {
    error: FormError<T> | null;
    setError: Dispatch<SetStateAction<FormError<T> | null>>;
    inputConfig: InputConfig<T>;
    pending: boolean;
    action(): void;
}

const FormContext = createContext<FormContextType<any> | undefined>(undefined);

function useFormContext<T extends ActionForm>() {
    const context = useContext<FormContextType<T> | undefined>(FormContext);
    if (!context) throw new Error('Form compound components must be used within <Form>');
    return context;
}

function FormWrapper<T extends ActionForm>({
    formAction,
    inputConfig,
    children,
}: FormWrapperProps<T>) {
    const [state, action, pending] = useActionState(formAction, null);
    const [error, setError] = useState<FormError<T> | null>(null);

    useEffect(() => {
        if (!state || !state.error) return setError(null);

        const firstKey = Object.keys(state.error)[0] as ActionKeys<T>;

        const firstMessage = state.error[firstKey]?.[0];
        setError({ key: firstKey, message: firstMessage });
    }, [state]);

    const contextValue: FormContextType<T> = {
        error,
        pending,
        action,
        setError,
        inputConfig,
    };

    return <FormContext value={contextValue}>{children}</FormContext>;
}

type FormProps = FormHTMLAttributes<HTMLFormElement>;

function Form<T extends ActionForm>({ children, ...formProps }: FormProps) {
    const { action } = useFormContext<T>();

    return (
        <form
            {...formProps}
            action={action}
            noValidate
            className={cn('*:w-full space-y-3', formProps.className)}>
            {children}
        </form>
    );
}

function FormInputs<T extends ActionForm>() {
    const { error, setError, inputConfig } = useFormContext<T>();

    return (
        <>
            {Object.entries(inputConfig).map(
                ([key, { type = 'text', placeholder, autoComplete }]) => (
                    <FormInput
                        key={key}
                        name={key}
                        type={type}
                        autoComplete={autoComplete}
                        placeholder={placeholder ?? key}
                        error={key === error?.key ? error.message : null}
                        onFocus={() => setError(null)}
                    />
                )
            )}
        </>
    );
}

function SubmitButton({ ...buttonProps }: ComponentProps<typeof Button>) {
    const { pending } = useFormContext();

    return (
        <Button
            {...buttonProps}
            variants={{ size: 'lg', rounded: 'full' }}
            disabled={pending}
        />
    );
}

export { Form, FormInputs, SubmitButton };
export default FormWrapper;
