export function Card({ children, className = "" }) {
    return (
        <div className={`bg-white p-4 rounded-lg shadow ${className}`}>
            {children}
        </div>
    );
}

export function CardContent({ children, className = "" }) {
    return <div className={`text-gray-800 ${className}`}>{children}</div>;
}
