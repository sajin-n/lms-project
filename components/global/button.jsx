import React from 'react';

const Button = ({ type = 'button', variant = 'primary', disabled = false, onClick, children, className = '' }) => {
  const baseStyles = 'w-full px-8 py-4 font-black text-base md:text-lg border-[4px] border-black uppercase tracking-wider shadow-[8px_8px_0px] shadow-black transition-all duration-100 disabled:opacity-50 disabled:cursor-not-allowed hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px] active:translate-x-[8px] active:translate-y-[8px] active:shadow-none';
  
  const variants = {
    primary: 'bg-[#FF0080] text-white',
    secondary: 'bg-[#00FFD1] text-black',
    accent: 'bg-[#FFFF00] text-black',
    dark: 'bg-[#000000] text-white',
    outline: 'bg-white text-black border-[#FF0080] hover:bg-[#FF0080] hover:text-white',
    light: 'bg-white text-black',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
