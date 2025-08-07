import { signInCredentials } from '@/app/(auth)/lib/action';
import AuthSection from '../components/AuthSection';
import AuthForm from '../components/AuthForm';

export default function Page() {
    return (
        <AuthSection
            title='Welcome back'
            Form={
                <AuthForm
                    formAction={signInCredentials}
                    placeholder={{ email: 'Email address', password: 'Password' }}
                    autoComplete={{ email: 'email', password: 'current-password' }}
                />
            }
            linkLabel="Don't have account yet?:Register:/register"
        />
    );
}
