const Button = ({ children, variant = 'primary', size = 'md', className = '', onClick, disabled, ...props }) => {
  const baseStyles =
    'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95';

  const variants = {
    primary:
      'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 focus:ring-blue-500 shadow-lg hover:shadow-2xl',
    secondary:
      'bg-white/80 backdrop-blur-xl text-gray-900 hover:bg-white/90 focus:ring-gray-500 shadow-lg border border-gray-200/50',
    outline:
      'border border-gray-300/50 bg-white/60 backdrop-blur-xl text-gray-700 hover:bg-white/80 focus:ring-gray-500',
    ghost: 'text-gray-600 hover:bg-white/60 backdrop-blur-xl focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
