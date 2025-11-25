import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  // Peaceful Blue Theme: rounded-3xl, clean blues
  const baseStyles = "py-4 px-6 rounded-3xl font-bold transition-all duration-200 transform active:scale-95 text-lg shadow-sm tracking-wide";
  
  const variants = {
    // Primary: Sky/Celeste Blue
    primary: "bg-sky-500 text-white hover:bg-sky-600 shadow-sky-200/50",
    // Secondary: White bg with soft blue border
    secondary: "bg-white text-mist-800 border-2 border-mist-100 hover:border-sky-300 hover:bg-mist-50",
    // Outline: Darker blue border
    outline: "border-2 border-mist-300 text-mist-700 hover:bg-mist-50",
    // Ghost: Transparent with blue text
    ghost: "bg-transparent text-sky-600 hover:bg-sky-50/50",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;