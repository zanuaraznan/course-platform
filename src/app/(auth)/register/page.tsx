import AuthSection from '../components/AuthSection';
import { signUpCredentials } from '@/app/(auth)/lib/action';
import FormWrapper, { Form, FormInputs, SubmitButton } from '@/components/ui/Form';

export default function Page() {
    return (
        <AuthSection
            title='Create an account'
            Form={
                <FormWrapper
                    formAction={signUpCredentials}
                    inputConfig={{
                        email: {
                            type: 'email',
                            autoComplete: 'email',
                            placeholder: 'Email address',
                        },
                        name: { placeholder: 'Username' },
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
            linkLabel='Already have an account?:Login:/login'></AuthSection>
    );
}
