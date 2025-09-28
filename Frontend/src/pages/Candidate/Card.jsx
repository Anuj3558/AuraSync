export const Card = ({ children, className = '', ...props }) => (
  <div
    className={`bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 transition-all duration-500 hover:shadow-2xl ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`px-8 py-6 border-b border-gray-100/50 ${className}`} {...props}>
    {children}
  </div>
);

export const CardContent = ({ children, className = '', ...props }) => (
  <div className={`px-8 py-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '', ...props }) => (
  <h3 className={`text-xl font-semibold text-gray-900 ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className = '', ...props }) => (
  <p className={`text-sm text-gray-600 mt-2 ${className}`} {...props}>
    {children}
  </p>
);
