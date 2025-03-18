
import React from 'react';
import { cn } from "@/lib/utils";

const CustomButton = ({ 
  children, 
  onClick, 
  variant = "primary", 
  size = "default",
  className = "", 
  disabled = false,
  ...props 
}) => {
  const baseStyles = "rounded-xl font-medium transition-all duration-300 flex items-center justify-center";
  
  const variantStyles = {
    primary: "bg-finance-blue text-white hover:shadow-md active:scale-[0.98]",
    secondary: "bg-finance-gray text-finance-black hover:bg-slate-100 active:scale-[0.98]",
    outline: "bg-transparent border border-finance-blue text-finance-blue hover:bg-finance-blue/5 active:scale-[0.98]",
    ghost: "bg-transparent text-finance-black hover:bg-finance-gray active:scale-[0.98]",
    danger: "bg-destructive text-white hover:bg-destructive/90 active:scale-[0.98]"
  };
  
  const sizeStyles = {
    default: "px-6 py-3 text-sm",
    sm: "px-4 py-2 text-xs",
    lg: "px-8 py-4 text-base"
  };

  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "";

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        disabledStyles,
        className
      )}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default CustomButton;
