import React from 'react';

const Button = ({ type = 'button', disabled = false, onClick, children }) => (
  <button
    type={type}
    disabled={disabled}
    onClick={onClick}
    className="w-full px-6 py-3 rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold text-base shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
  >
    {children}
  </button>
);

export default Button;
