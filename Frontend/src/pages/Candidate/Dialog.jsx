export const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ${
        open ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-md transition-all duration-500"
        onClick={() => onOpenChange(false)}
      />
      <div
        className={`relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto border border-white/20 transform transition-all duration-500 ${
          open ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export const DialogContent = ({ children, className = '' }) => <div className={`p-8 ${className}`}>{children}</div>;

export const DialogHeader = ({ children }) => <div className="mb-6">{children}</div>;

export const DialogTitle = ({ children, className = '' }) => (
  <h2 className={`text-xl font-semibold text-gray-900 ${className}`}>{children}</h2>
);

export const DialogDescription = ({ children }) => (
  <p className="text-sm text-gray-600 mt-3 leading-relaxed">{children}</p>
);
