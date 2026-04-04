import React from 'react';

const InputField = ({ label, type = 'text', value, onChange, placeholder, error, name, disabled, ...rest }) => (
  <div className="mb-4">
    <label className="block text-sm text-gray-700 font-semibold mb-2" htmlFor={name}>{label}</label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-4 py-3 text-gray-900 bg-gray-50 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 hover:border-gray-400 disabled:opacity-60 disabled:cursor-not-allowed ${
        error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : 'border-gray-300'
      }`}
      aria-invalid={!!error}
      aria-describedby={error ? `${name}-error` : undefined}
      {...rest}
    />
    {error && <p id={`${name}-error`} className="text-xs text-red-600 mt-2 flex items-center"><svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>{error}</p>}
  </div>
);

export default InputField;
