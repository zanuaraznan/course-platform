type PageHeaderProps = {
    title: string;
    children?: React.ReactNode;
    className?: string;
};

export default function PageHeader({ title, children, className }: PageHeaderProps) {
    return (
        <div className={className}>
            <h1 className='font-medium text-xl'>{title}</h1>
            {children}
        </div>
    );
}
