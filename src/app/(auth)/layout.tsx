export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className='container px-4 overflow-auto flex flex-center'>
            <section className='w-full max-w-xs flex flex-col flex-center gap-4 *:w-full text-center my-8'>
                {children}
            </section>
        </main>
    );
}
