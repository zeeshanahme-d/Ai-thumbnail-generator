import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline';
    fullWidth?: boolean;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    fullWidth = true,
    className = '',
    ...props
}) => {
    const baseClasses = 'px-6 py-3.5 active:scale-95 transition-all rounded-full';

    const variantClasses = {
        primary: 'bg-primary hover:bg-primary-hover',
        secondary: 'bg-secondary hover:bg-secondary-hover',
        outline: 'bg-transparent border border-white/20 hover:bg-white/10'
    };

    const widthClass = fullWidth ? 'w-full' : '';

    const combinedClasses = `
        ${baseClasses}
        ${variantClasses[variant]}
        ${widthClass}
        ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
        <button
            className={combinedClasses}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;

