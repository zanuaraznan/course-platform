import { signInCredentials } from '@/app/(auth)/lib/action';
import AuthSection from '../components/AuthSection';
import AuthForm from '../components/AuthForm';

export default function Page() {
    return (
        <AuthSection
            title='Selamat Datang Kembali'
            Form={
                <AuthForm
                    formAction={signInCredentials}
                    placeholder={{ email: 'Alamat email', password: 'Password' }}
                    autoComplete={{ email: 'email', password: 'current-password' }}
                />
            }
            linkLabel='Belum punya akun?:Daftar:/register'
        />
    );
}
