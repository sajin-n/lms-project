import React from 'react';

const Card = ({ children, className = '', variant = 'default', dark = false }) => {
  const baseStyles = 'border-[4px] border-black p-8 shadow-[8px_8px_0px] shadow-black transition-all duration-150 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px]';
  
  const variants = {
    default: `bg-white text-black ${baseStyles}`,
    accent: `bg-[#FFFF00] text-black ${baseStyles}`,
    primary: `bg-[#FF0080] text-white ${baseStyles}`,
    secondary: `bg-[#00FFD1] text-black ${baseStyles}`,
    dark: `bg-black text-white border-white ${baseStyles}`,
  };

  return (
    <div className={`${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

export default Card;