
import React from 'react';
import { cn } from "@/lib/utils";

const CustomCard = ({ 
  children, 
  className = "", 
  hover = false,
  ...props 
}) => {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300",
        hover && "hover:shadow-md hover:translate-y-[-2px]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default CustomCard;
