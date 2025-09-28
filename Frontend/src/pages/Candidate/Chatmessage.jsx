import { useEffect, useState } from "react";

export const ChatMessage = ({ message, isUser, timestamp, isNew }) => {
  const [isVisible, setIsVisible] = useState(!isNew);

  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  if (!message) return null;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 transform transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
      <div className={`max-w-xs lg:max-w-md px-6 py-4 rounded-2xl transition-all duration-300 ${
        isUser 
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
          : 'bg-white/80 backdrop-blur-xl text-gray-900 shadow-md hover:shadow-lg border border-gray-200/50 transform hover:scale-105'
      }`}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
        {timestamp && (
          <p className={`text-xs mt-2 ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
            {timestamp}
          </p>
        )}
      </div>
    </div>
  );
};