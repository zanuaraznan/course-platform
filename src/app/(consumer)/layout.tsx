import Navbar from './components/Navbar';

export default function ConsumerLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            {children}
        </>
    );
}
