import AuthSection from '../components/AuthSection';
import { signInCredentials } from '@/app/(auth)/lib/action';
import FormWrapper, { Form, FormInputs, SubmitButton } from '@/components/ui/Form';

export default function Page() {
    return (
        <AuthSection
            title='Welcome back'
            Form={
                <FormWrapper
                    formAction={signInCredentials}
                    inputConfig={{
                        email: {
                            type: 'email',
                            autoComplete: 'email',
                            placeholder: 'Email address',
                        },
                        password: {
                            autoComplete: 'current-password',
                            type: 'password',
                        },
                    }}>
                    <Form>
                        <FormInputs />
                        <SubmitButton>Continue</SubmitButton>
                    </Form>
                </FormWrapper>
            }
            linkLabel="Don't have account yet?:Register:/register"></AuthSection>
    );
}
