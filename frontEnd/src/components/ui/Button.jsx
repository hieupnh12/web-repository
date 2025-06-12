import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200';
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;