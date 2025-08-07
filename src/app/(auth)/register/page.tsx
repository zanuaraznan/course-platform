import { signUpCredentials } from '@/app/(auth)/lib/action';
import AuthSection from '../components/AuthSection';
import AuthForm from '../components/AuthForm';

export default function Page() {
    return (
        <AuthSection
            title='Buat akun'
            Form={
                <AuthForm
                    formAction={signUpCredentials}
                    placeholder={{
                        name: 'Nama',
                        email: 'Alamat email',
                        password: 'Password',
                    }}
                    autoComplete={{
                        name: 'name',
                        email: 'email',
                        password: 'current-password',
                    }}
                />
            }
            linkLabel='Belum punya akun?:Masuk:/login'
        />
    );
}
