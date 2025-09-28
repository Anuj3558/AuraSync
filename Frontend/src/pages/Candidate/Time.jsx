import { Badge } from "lucide-react";

export const TimeDisplay = ({ timeRemaining, questionTimeRemaining, isActive, currentQuestion, totalQuestions }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = (time, max) => {
    const percentage = time / max;
    if (percentage <= 0.25) return 'text-red-600 animate-pulse';
    if (percentage <= 0.5) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="bg-white/80 backdrop-blur-xl rounded-xl px-4 py-2 border border-gray-200/50">
        <div className="text-center">
          <p className="text-xs text-gray-500">Question</p>
          <p className={`text-lg font-mono font-bold transition-colors duration-300 ${
            getTimerColor(questionTimeRemaining, 120)
          }`}>
            {formatTime(questionTimeRemaining)}
          </p>
        </div>
      </div>
      
      <div className="bg-white/80 backdrop-blur-xl rounded-xl px-4 py-2 border border-gray-200/50">
        <div className="text-center">
          <p className="text-xs text-gray-500">Total</p>
          <p className={`text-lg font-mono font-bold transition-colors duration-300 ${
            getTimerColor(timeRemaining, 1200)
          }`}>
            {formatTime(timeRemaining)}
          </p>
        </div>
      </div>
      
      <Badge className="transform transition-all duration-300 hover:scale-110">
        Question {currentQuestion} of {totalQuestions}
      </Badge>
      
      {isActive && (
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700">Live</span>
        </div>
      )}
    </div>
  );
};