import React from 'react';

const InputField = ({ label, type = 'text', value, onChange, placeholder, error, name, disabled, ...rest }) => (
  <div className="mb-6">
    <label className="block text-black font-black text-lg uppercase tracking-wide mb-3" htmlFor={name}>
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-6 py-4 text-black bg-white border-[4px] font-semibold placeholder:text-gray-400 placeholder:font-medium focus:outline-none focus:border-[#FF0080] transition-all duration-150 uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed ${
        error ? 'border-[#FF0080]' : 'border-black'
      }`}
      aria-invalid={!!error}
      aria-describedby={error ? `${name}-error` : undefined}
      {...rest}
    />
    {error && (
      <p id={`${name}-error`} className="text-xs font-black text-[#FF0080] mt-3 flex items-center uppercase tracking-wider">
        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
        </svg>
        {error}
      </p>
    )}
  </div>
);

export default InputField;
