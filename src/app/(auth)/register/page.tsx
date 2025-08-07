import { signUpCredentials } from '@/app/(auth)/lib/action';
import AuthSection from '../components/AuthSection';
import AuthForm from '../components/AuthForm';

export default function Page() {
    return (
        <AuthSection
            title='Create an account'
            Form={
                <AuthForm
                    formAction={signUpCredentials}
                    placeholder={{
                        name: 'Username',
                        email: 'Email address',
                        password: 'Password',
                    }}
                    autoComplete={{
                        name: 'name',
                        email: 'email',
                        password: 'current-password',
                    }}
                />
            }
            linkLabel='Already have an account?:Login:/login'
        />
    );
}
