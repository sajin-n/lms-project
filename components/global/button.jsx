import React from 'react';

const Button = ({ type = 'button', variant = 'primary', disabled = false, onClick, children, className = '' }) => {
  const baseStyles = 'w-full px-6 py-3 font-black text-base border-[3px] border-black rounded-xl shadow-[4px_4px_0px] shadow-black transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[#FF6B6B] text-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none',
    secondary: 'bg-[#4ECDC4] text-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none',
    accent: 'bg-[#FFE66D] text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none',
    dark: 'bg-[#1A1A2E] text-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none',
    outline: 'bg-white text-black hover:bg-[#FF6B6B] hover:text-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none',
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
