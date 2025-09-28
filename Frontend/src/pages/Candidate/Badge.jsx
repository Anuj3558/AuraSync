const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-blue-100/80 text-blue-800 backdrop-blur-sm',
    outline: 'border border-gray-300/50 text-gray-700 bg-white/60 backdrop-blur-sm',
    success: 'bg-green-100/80 text-green-800 backdrop-blur-sm',
    warning: 'bg-yellow-100/80 text-yellow-800 backdrop-blur-sm',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
