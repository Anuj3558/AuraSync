import React, { useState, useEffect, useRef } from 'react';
import { Brain, ArrowLeft, Play, RotateCcw, Upload, FileText, CheckCircle, MessageSquare, Send, Mic, MicOff, User, Briefcase, Mail, Phone } from 'lucide-react';

// Custom Button Component
const Button = ({ children, variant = 'primary', size = 'md', className = '', onClick, disabled, ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 focus:ring-blue-500 shadow-lg hover:shadow-2xl',
    secondary: 'bg-white/80 backdrop-blur-xl text-gray-900 hover:bg-white/90 focus:ring-gray-500 shadow-lg border border-gray-200/50',
    outline: 'border border-gray-300/50 bg-white/60 backdrop-blur-xl text-gray-700 hover:bg-white/80 focus:ring-gray-500',
    ghost: 'text-gray-600 hover:bg-white/60 backdrop-blur-xl focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base'
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

// Custom Card Components with enhanced styling
const Card = ({ children, className = '', ...props }) => (
  <div className={`bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 transition-all duration-500 hover:shadow-2xl ${className}`} {...props}>
    {children}
  </div>
);

const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`px-8 py-6 border-b border-gray-100/50 ${className}`} {...props}>
    {children}
  </div>
);

const CardContent = ({ children, className = '', ...props }) => (
  <div className={`px-8 py-6 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '', ...props }) => (
  <h3 className={`text-xl font-semibold text-gray-900 ${className}`} {...props}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = '', ...props }) => (
  <p className={`text-sm text-gray-600 mt-2 ${className}`} {...props}>
    {children}
  </p>
);

// Custom Badge Component
const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-blue-100/80 text-blue-800 backdrop-blur-sm',
    outline: 'border border-gray-300/50 text-gray-700 bg-white/60 backdrop-blur-sm',
    success: 'bg-green-100/80 text-green-800 backdrop-blur-sm',
    warning: 'bg-yellow-100/80 text-yellow-800 backdrop-blur-sm'
  };
  
  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Custom Dialog Components
const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ${open ? 'opacity-100' : 'opacity-0'}`}>
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-md transition-all duration-500"
        onClick={() => onOpenChange(false)}
      />
      <div className={`relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto border border-white/20 transform transition-all duration-500 ${open ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        {children}
      </div>
    </div>
  );
};

const DialogContent = ({ children, className = '' }) => (
  <div className={`p-8 ${className}`}>
    {children}
  </div>
);

const DialogHeader = ({ children }) => (
  <div className="mb-6">
    {children}
  </div>
);

const DialogTitle = ({ children, className = '' }) => (
  <h2 className={`text-xl font-semibold text-gray-900 ${className}`}>
    {children}
  </h2>
);

const DialogDescription = ({ children }) => (
  <p className="text-sm text-gray-600 mt-3 leading-relaxed">
    {children}
  </p>
);

// User Details Component with enhanced animations
const UserDetailsCard = ({ userInfo, jobInfo, loading }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => setIsVisible(true), 300);
    }
  }, [loading]);

  if (loading) {
    return (
      <Card className="mb-8 overflow-hidden">
        <CardContent className="p-8">
          <div className="animate-pulse">
            <div className="flex items-center space-x-6">
              <div className="rounded-full bg-gradient-to-r from-gray-200 to-gray-300 h-16 w-16 animate-pulse"></div>
              <div className="space-y-3 flex-1">
                <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-2/3 animate-pulse"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-gradient-to-r from-blue-50/80 to-purple-50/80 border border-blue-200/30 transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* User Information */}
          <div className="transform transition-all duration-500 hover:scale-102">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="p-2 bg-blue-100/80 rounded-xl mr-3">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              Candidate Information
            </h3>
            <div className="space-y-3">
              {[
                { icon: User, label: 'Name', value: userInfo?.name || 'Not provided' },
                { icon: Mail, label: 'Email', value: userInfo?.email || 'Not provided' },
                { icon: Phone, label: 'Phone', value: userInfo?.phone || 'Not provided' }
              ].map((item, index) => (
                <div key={index} className={`flex items-center text-sm transform transition-all duration-500 delay-${index * 100}`} style={{ transitionDelay: `${index * 100}ms` }}>
                  <div className="p-1.5 bg-gray-100/80 rounded-lg mr-3">
                    <item.icon className="h-4 w-4 text-gray-500" />
                  </div>
                  <span className="font-medium text-gray-700 min-w-[50px]">{item.label}:</span>
                  <span className="ml-2 text-gray-900 text-xs">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Job Information */}
          <div className="transform transition-all duration-500 hover:scale-102 pt-4 border-t border-gray-200/50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <div className="p-2 bg-purple-100/80 rounded-xl mr-3">
                <Briefcase className="h-5 w-5 text-purple-600" />
              </div>
              Applied Position
            </h3>
            <div className="space-y-3">
              <div className="transform transition-all duration-300 hover:translate-x-1">
                <span className="font-medium text-sm text-gray-700">Position:</span>
                <p className="text-gray-900 mt-1 text-base">{jobInfo?.title || 'Senior Frontend Developer'}</p>
              </div>
              <div className="transform transition-all duration-300 hover:translate-x-1">
                <span className="font-medium text-sm text-gray-700">Company:</span>
                <p className="text-gray-900 mt-1 text-sm">{jobInfo?.company || 'TechCorp Inc.'}</p>
              </div>
              <div className="transform transition-all duration-300 hover:translate-x-1">
                <span className="font-medium text-sm text-gray-700">Department:</span>
                <p className="text-gray-900 mt-1 text-sm">{jobInfo?.department || 'Engineering'}</p>
              </div>
              <div className="transform transition-all duration-300 hover:scale-105 inline-block">
                <Badge variant="success">
                  {jobInfo?.status || 'Interview Scheduled'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Job Description */}
          {jobInfo?.description && (
            <div className={`pt-4 border-t border-gray-200/50 transform transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center text-sm">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mr-3"></div>
                Job Description
              </h4>
              <p className="text-xs text-gray-700 leading-relaxed bg-white/50 rounded-xl p-3 backdrop-blur-sm">
                {jobInfo.description}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Enhanced Resume Upload Component
const ResumeUpload = ({ onComplete, userInfo }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [candidateInfo, setCandidateInfo] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e) => {
    e.preventDefault();
    handleFiles(e.target.files);
  };

  const handleFiles = (files) => {
    if (files && files[0]) {
      setUploading(true);
      setProgress(0);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 100);

      // Simulate upload and processing
      setTimeout(() => {
        setProgress(100);
        const mockCandidate = {
          name: userInfo?.name || "John Doe",
          email: userInfo?.email || "john.doe@email.com",
          phone: userInfo?.phone || "+1 (555) 123-4567",
          experience: "5 years",
          skills: ["React", "Node.js", "Python", "AWS"]
        };
        setCandidateInfo(mockCandidate);
        
        setTimeout(() => {
          setUploading(false);
          setUploaded(true);
          setTimeout(() => onComplete(mockCandidate), 800);
        }, 500);
      }, 2500);
    }
  };

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="transform transition-all duration-500 hover:scale-102">
      <CardContent className="p-10">
        {!uploaded ? (
          <div>
            <div
              className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all duration-500 transform ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50/50 scale-105 shadow-lg' 
                  : 'border-gray-300/50 hover:border-gray-400/70 hover:bg-gray-50/30'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {uploading ? (
                <div className="space-y-6">
                  <div className="w-20 h-20 mx-auto relative">
                    <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Upload className="h-8 w-8 text-blue-600 animate-bounce" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-gray-900">Processing Resume</h3>
                    <p className="text-gray-600">Extracting information and generating questions...</p>
                    
                    {/* Progress bar */}
                    <div className="w-full max-w-xs mx-auto">
                      <div className="bg-gray-200/50 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-blue-600 to-purple-600 h-full transition-all duration-300 ease-out rounded-full"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">{Math.round(progress)}% complete</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center transform transition-all duration-500 hover:scale-110 hover:rotate-3">
                    <Upload className="h-10 w-10 text-white" />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-semibold text-gray-900">Upload Your Resume</h3>
                    <p className="text-gray-600 text-lg">Drag and drop your resume here, or click to browse</p>
                    <p className="text-sm text-gray-500 mt-3">Supports PDF, DOC, DOCX (max 10MB)</p>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleChange}
                    className="hidden"
                    id="resume-upload"
                  />
                  
                  <Button 
                    variant="secondary" 
                    size="lg"
                    onClick={handleButtonClick}
                    className="cursor-pointer transform transition-all duration-300 hover:scale-105"
                  >
                    <FileText className="mr-3 h-5 w-5" />
                    Choose File
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={`text-center space-y-6 transform transition-all duration-700 ${uploaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            <div className="w-20 h-20 mx-auto bg-green-100/80 rounded-3xl flex items-center justify-center transform transition-all duration-500 animate-bounce">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-semibold text-gray-900">Resume Processed Successfully!</h3>
              <p className="text-gray-600 text-lg">Information extracted and interview questions generated</p>
            </div>
            {candidateInfo && (
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-left border border-gray-200/50 transform transition-all duration-500 hover:scale-102">
                <h4 className="font-semibold mb-4 text-lg text-gray-900">Extracted Information:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Name', value: candidateInfo.name },
                    { label: 'Email', value: candidateInfo.email },
                    { label: 'Experience', value: candidateInfo.experience },
                    { label: 'Key Skills', value: candidateInfo.skills.join(', ') }
                  ].map((item, index) => (
                    <div key={index} className={`transform transition-all duration-500 delay-${index * 100}`} style={{ transitionDelay: `${index * 100}ms` }}>
                      <span className="font-medium text-gray-700 text-sm">{item.label}:</span>
                      <p className="text-gray-900 mt-1">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Enhanced Chat Message Component
const ChatMessage = ({ message, isUser, timestamp, isNew }) => {
  const [isVisible, setIsVisible] = useState(!isNew);

  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 transform transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
      <div className={`max-w-xs lg:max-w-md px-6 py-4 rounded-2xl transition-all duration-300 ${
        isUser 
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
          : 'bg-white/80 backdrop-blur-xl text-gray-900 shadow-md hover:shadow-lg border border-gray-200/50 transform hover:scale-105'
      }`}>
        <p className="text-sm leading-relaxed">{message}</p>
        {timestamp && (
          <p className={`text-xs mt-2 ${isUser ? 'text-blue-100' : 'text-gray-500'}`}>
            {timestamp}
          </p>
        )}
      </div>
    </div>
  );
};

// Enhanced Chat Box Component with Apple-like animations and timers
const ChatBox = ({ onComplete, userInfo }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hello ${userInfo?.name || 'there'}! I'm your AI interviewer. Let's start with some questions about your background. Can you tell me about your experience with React?`,
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isNew: true
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [totalInterviewTime] = useState(20 * 60); // 20 minutes total
  const [questionTime] = useState(3 * 60); // 3 minutes per question
  const [totalTimeRemaining, setTotalTimeRemaining] = useState(20 * 60);
  const [questionTimeRemaining, setQuestionTimeRemaining] = useState(3 * 60);
  const [isInterviewStarted, setIsInterviewStarted] = useState(true);
  const messagesEndRef = useRef(null);
  const totalQuestions = 6;

  const questions = [
    "Can you tell me about your experience with React?",
    "How do you handle state management in large applications?",
    "Describe a challenging bug you've encountered and how you solved it.",
    "What's your approach to testing frontend applications?",
    "How do you ensure your applications are accessible?",
    "Where do you see yourself in the next 5 years?"
  ];

  // Timer logic
  useEffect(() => {
    let interval;
    if (isInterviewStarted) {
      interval = setInterval(() => {
        setTotalTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            onComplete(); // Auto-complete when time runs out
            return 0;
          }
          return prev - 1;
        });
        
        setQuestionTimeRemaining(prev => {
          if (prev <= 1) {
            // Auto-advance to next question when time runs out
            if (currentQuestion < totalQuestions) {
              setTimeout(() => {
                const nextQuestion = {
                  id: messages.length + 1,
                  text: questions[currentQuestion],
                  isUser: false,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  isNew: true
                };
                setMessages(prev => [...prev, nextQuestion]);
                setCurrentQuestion(prev => prev + 1);
              }, 100);
              return questionTime; // Reset for next question
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isInterviewStarted, currentQuestion, totalQuestions, questionTime, questions, messages.length, onComplete]);

  // Get timer-based color overlay
  const getTimerOverlayColor = () => {
    const totalProgress = 1 - (totalTimeRemaining / totalInterviewTime);
    
    if (totalProgress <= 0.5) {
      // Green to Yellow (0-50%)
      const alpha = 0.1 + (totalProgress * 0.1); // 0.1 to 0.15
      const green = Math.max(200, 255 - (totalProgress * 110)); // 255 to 145
      return `rgba(34, ${green}, 34, ${alpha})`; // Green with increasing alpha
    } else if (totalProgress <= 0.8) {
      // Yellow to Orange (50-80%)
      const adjustedProgress = (totalProgress - 0.5) / 0.3;
      const alpha = 0.15 + (adjustedProgress * 0.1); // 0.15 to 0.25
      const red = 255;
      const green = Math.max(140, 255 - (adjustedProgress * 115)); // 255 to 140
      return `rgba(${red}, ${green}, 34, ${alpha})`;
    } else {
      // Orange to Red (80-100%)
      const adjustedProgress = (totalProgress - 0.8) / 0.2;
      const alpha = 0.25 + (adjustedProgress * 0.15); // 0.25 to 0.4
      const red = 255;
      const green = Math.max(0, 140 - (adjustedProgress * 140)); // 140 to 0
      return `rgba(${red}, ${green}, 34, ${alpha})`;
    }
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!currentMessage.trim() || sendingMessage) return;

    setSendingMessage(true);

    const newMessage = {
      id: messages.length + 1,
      text: currentMessage,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isNew: true
    };

    setMessages(prev => [...prev, newMessage]);
    setCurrentMessage('');

    // Show sending animation
    setTimeout(() => {
      setSendingMessage(false);
      setIsTyping(true);
    }, 300);

    // Simulate AI response with typing indicator
    setTimeout(() => {
      setIsTyping(false);
      
      if (currentQuestion < totalQuestions) {
        const aiResponse = {
          id: messages.length + 2,
          text: questions[currentQuestion],
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isNew: true
        };
        setMessages(prev => [...prev, aiResponse]);
        setCurrentQuestion(prev => prev + 1);
        // Reset question timer for next question
        setQuestionTimeRemaining(questionTime);
      } else {
        const finalMessage = {
          id: messages.length + 2,
          text: `Thank you for your responses, ${userInfo?.name || 'candidate'}! That concludes our interview. Your answers have been recorded and will be reviewed by our team.`,
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isNew: true
        };
        setMessages(prev => [...prev, finalMessage]);
        setTimeout(() => onComplete(), 3000);
      }
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-[700px] flex flex-col shadow-2xl transform transition-all duration-500 relative overflow-hidden">
      {/* Timer-based Color Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-1000 z-10 rounded-2xl"
        style={{ 
          backgroundColor: getTimerOverlayColor(),
          mixBlendMode: 'multiply'
        }}
      ></div>
      
      <CardHeader className="bg-gradient-to-r h-full from-blue-50/50 to-purple-50/50 backdrop-blur-xl relative z-20">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl">AI Interview Session</CardTitle>
            <CardDescription className="text-lg">Answer each question thoughtfully</CardDescription>
          </div>
          <div className="flex items-center space-x-4">
            {/* Question Timer */}
            <div className="bg-white/80 backdrop-blur-xl rounded-xl px-4 py-2 border border-gray-200/50">
              <div className="text-center">
                <p className="text-xs text-gray-500">Question Time</p>
                <p className={`text-lg font-mono font-bold transition-colors duration-300 ${
                  questionTimeRemaining <= 30 ? 'text-red-600' : 
                  questionTimeRemaining <= 60 ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {formatTime(questionTimeRemaining)}
                </p>
              </div>
            </div>
            
            {/* Total Interview Timer */}
            <div className="bg-white/80 backdrop-blur-xl rounded-xl px-4 py-2 border border-gray-200/50">
              <div className="text-center">
                <p className="text-xs text-gray-500">Total Time</p>
                <p className={`text-lg font-mono font-bold transition-colors duration-300 ${
                  totalTimeRemaining <= 300 ? 'text-red-600' : 
                  totalTimeRemaining <= 600 ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {formatTime(totalTimeRemaining)}
                </p>
              </div>
            </div>
            
            <Badge className="transform transition-all duration-300 hover:scale-110">
              Question {currentQuestion} of {totalQuestions}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-6 bg-gradient-to-b from-gray-50/30 to-white/80 backdrop-blur-xl relative z-20">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-6 space-y-2 scrollbar-hide max-h-[420px]" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style jsx>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          {messages.map((message, index) => (
            <ChatMessage
              key={message.id}
              message={message.text}
              isUser={message.isUser}
              timestamp={message.timestamp}
              isNew={message.isNew && index === messages.length - 1}
            />
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start mb-6">
              <div className="bg-white/80 backdrop-blur-xl px-6 py-4 rounded-2xl shadow-md border border-gray-200/50">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-sm text-gray-500">AI is typing...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Time Warning Alert */}
        {(totalTimeRemaining <= 300 || questionTimeRemaining <= 60) && (
          <div className={`mb-4 p-3 rounded-xl border transition-all duration-500 ${
            totalTimeRemaining <= 300 
              ? 'bg-red-50/80 border-red-200 text-red-800' 
              : 'bg-yellow-50/80 border-yellow-200 text-yellow-800'
          }`}>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                totalTimeRemaining <= 300 ? 'bg-red-500' : 'bg-yellow-500'
              }`}></div>
              <span className="text-sm font-medium">
                {totalTimeRemaining <= 300 
                  ? `Interview ending in ${formatTime(totalTimeRemaining)}` 
                  : `Question time remaining: ${formatTime(questionTimeRemaining)}`
                }
              </span>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="flex items-end space-x-4 bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-gray-200/50">
          <div className="flex-1">
            <textarea
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your response..."
              className="w-full p-4 border-0 bg-transparent resize-none focus:ring-0 focus:outline-none placeholder-gray-500 text-gray-900"
              rows={2}
              disabled={sendingMessage || isTyping}
            />
          </div>
          <div className="flex flex-col space-y-3">
            <Button
              onClick={() => setIsRecording(!isRecording)}
              variant={isRecording ? "danger" : "secondary"}
              size="sm"
              className={`transition-all duration-300 ${isRecording ? 'animate-pulse' : ''}`}
            >
              {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            <Button 
              onClick={handleSendMessage} 
              disabled={!currentMessage.trim() || sendingMessage || isTyping}
              className={`transition-all duration-300 ${sendingMessage ? 'animate-pulse' : ''}`}
            >
              <Send className={`h-5 w-5 transition-transform duration-300 ${sendingMessage ? 'translate-x-1' : ''}`} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Component with enhanced animations
const IntervieweeUI = () => {
  const [currentStep, setCurrentStep] = useState('loading');
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const [candidateInfo, setCandidateInfo] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [jobInfo, setJobInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [interviewProgress, setInterviewProgress] = useState({ currentQuestion: 1, total: 6 });
  const [pageTransition, setPageTransition] = useState(false);

  // Function to extract user ID from URL
  const getUserIdFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId') || urlParams.get('id');
    
    if (!userId) {
      const pathParts = window.location.pathname.split('/');
      const userIdFromPath = pathParts[pathParts.length - 1];
      if (userIdFromPath && !isNaN(userIdFromPath)) {
        return userIdFromPath;
      }
    }
    
    return userId || 'demo123';
  };

  // Function to fetch user data
  const fetchUserData = async (userId) => {
    try {
      // Simulate API call - replace with actual API endpoints
      // const response = await fetch(`/api/users/${userId}`);
      // const userData = await response.json();
      
      // Mock data for demonstration
      const userData = {
        id: userId,
        name: "Sarah Johnson",
        email: "sarah.johnson@email.com",
        phone: "+1 (555) 987-6543"
      };
      
      return userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  // Function to fetch job data
  const fetchJobData = async (userId) => {
    try {
      // Simulate API call - replace with actual API endpoints
      // const response = await fetch(`/api/jobs/user/${userId}`);
      // const jobData = await response.json();
      
      // Mock data for demonstration
      const jobData = {
        title: "Senior Frontend Developer",
        company: "TechCorp Inc.",
        department: "Engineering",
        status: "Interview Scheduled",
        appliedDate: "2024-03-15",
        description: "We are looking for a Senior Frontend Developer to join our growing engineering team. The ideal candidate will have 5+ years of experience with React, TypeScript, and modern web technologies. You'll be responsible for building user-facing applications, collaborating with designers and backend developers, and mentoring junior team members."
      };
      
      return jobData;
    } catch (error) {
      console.error('Error fetching job data:', error);
      return null;
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      
      // Extract user ID from URL
      const userId = getUserIdFromURL();
      
      // Fetch user and job data
      const [userData, jobData] = await Promise.all([
        fetchUserData(userId),
        fetchJobData(userId)
      ]);
      
      setUserInfo(userData);
      setJobInfo(jobData);
      setLoading(false);
      
      // Check for existing session after data is loaded
      setTimeout(() => {
        const existingSession = false; // Replace with actual session check
        if (existingSession) {
          setShowWelcomeBack(true);
        } else {
          setCurrentStep('upload');
        }
      }, 1000);
    };

    initializeData();
  }, []);

  const handleStepTransition = (newStep) => {
    setPageTransition(true);
    setTimeout(() => {
      setCurrentStep(newStep);
      setPageTransition(false);
    }, 300);
  };

  const handleResumeUploadComplete = (info) => {
    setCandidateInfo(info);
    handleStepTransition('interview');
  };

  const handleInterviewComplete = () => {
    handleStepTransition('complete');
  };

  const handleResumeInterview = () => {
    setShowWelcomeBack(false);
    handleStepTransition('interview');
  };

  const handleRestartInterview = () => {
    setCandidateInfo(null);
    setShowWelcomeBack(false);
    handleStepTransition('upload');
  };

  const renderStepContent = () => {
    if (loading || currentStep === 'loading') {
      return (
        <div className="flex justify-center items-center min-h-[500px]">
          <div className="text-center space-y-6">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain className="h-8 w-8 text-blue-600 animate-pulse" />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-semibold text-gray-900">Loading Interview Session</h3>
              <p className="text-gray-600 text-lg">Preparing your personalized interview experience...</p>
              <div className="flex justify-center space-x-1 mt-4">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const content = (() => {
      switch (currentStep) {
        case 'upload':
          return (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Candidate Info */}
              <div className="lg:col-span-1">
                <UserDetailsCard userInfo={userInfo} jobInfo={jobInfo} loading={loading} />
              </div>
              
              {/* Right Column - Resume Upload */}
              <div className="lg:col-span-2 space-y-8">
                <div className="text-center transform transition-all duration-700 delay-200">
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-6">
                    AI Interview Assessment
                  </h1>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    Upload your resume to begin the AI-powered technical interview. 
                    Our system will extract your information and generate personalized questions 
                    tailored to your experience and the <span className="font-semibold text-blue-600">{jobInfo?.title}</span> position.
                  </p>
                </div>
                <ResumeUpload onComplete={handleResumeUploadComplete} userInfo={userInfo} />
              </div>
            </div>
          );

        case 'interview':
          return (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Candidate Info */}
              <div className="lg:col-span-1">
                <UserDetailsCard userInfo={userInfo} jobInfo={jobInfo} loading={loading} />
              </div>
              
              {/* Right Column - Interview Chat */}
              <div className="lg:col-span-2 space-y-6 h-full">
                <div className="flex items-center justify-between transform transition-all duration-500">
                  <div className="space-y-2">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                      Welcome, {candidateInfo?.name || userInfo?.name || 'Candidate'}
                    </h1>
                    <p className="text-gray-600 text-xl">
                      Complete your AI-powered technical assessment for <span className="font-semibold text-purple-600">{jobInfo?.title}</span>
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-xl rounded-2xl px-6 py-3 border border-gray-200/50">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-gray-700">Live Interview</span>
                    </div>
                  </div>
                </div>
                
                <ChatBox onComplete={handleInterviewComplete} userInfo={userInfo} />
              </div>
            </div>
          );

        case 'complete':
          return (
            <div className="max-w-3xl mx-auto text-center space-y-8 transform transition-all duration-700">
              <Card className="shadow-2xl bg-gradient-to-br from-white/90 to-blue-50/50 backdrop-blur-xl border border-blue-200/30">
                <CardContent className="p-12">
                  <div className="w-28 h-28 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 transform transition-all duration-500 hover:scale-110 hover:rotate-3">
                    <Brain className="h-14 w-14 text-white" />
                  </div>
                  <CardTitle className="text-4xl mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Interview Complete!
                  </CardTitle>
                  <CardDescription className="text-xl text-gray-600 mb-8">
                    Thank you for completing the AI assessment, <span className="font-semibold text-blue-600">{candidateInfo?.name || userInfo?.name}</span>
                  </CardDescription>
                  
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-gray-200/50">
                    <h3 className="font-semibold text-xl mb-6 text-gray-900">What happens next?</h3>
                    <div className="space-y-4">
                      {[
                        'Your responses are being analyzed by our AI system',
                        'A detailed performance report will be generated',
                        `The hiring team at ${jobInfo?.company} will review your results within 24 hours`
                      ].map((text, index) => (
                        <div key={index} className={`flex items-center gap-4 text-left transform transition-all duration-500 delay-${index * 200}`} style={{ transitionDelay: `${index * 200}ms` }}>
                          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex-shrink-0"></div>
                          <span className="text-gray-700">{text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="secondary" className="flex-1 transform transition-all duration-300 hover:scale-105">
                      <MessageSquare className="mr-3 h-5 w-5" />
                      View Results Dashboard
                    </Button>
                    <Button onClick={handleRestartInterview} variant="outline" className="flex-1 transform transition-all duration-300 hover:scale-105">
                      <RotateCcw className="mr-3 h-5 w-5" />
                      Take Another Interview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          );

        default:
          return null;
      }
    })();

    return (
      <div className={`transform transition-all duration-500 ${pageTransition ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        {content}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
        {renderStepContent()}
      </main>

      {/* Enhanced Welcome Back Dialog */}
      <Dialog open={showWelcomeBack} onOpenChange={setShowWelcomeBack}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-blue-100/80 rounded-xl">
                <Brain className="h-7 w-7 text-blue-600" />
              </div>
              Welcome Back, {userInfo?.name}!
            </DialogTitle>
            <DialogDescription className="text-base leading-relaxed">
              We found an unfinished interview session for the <span className="font-semibold text-blue-600">{jobInfo?.title}</span> position. 
              Would you like to continue where you left off?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Progress:</span>
                <Badge variant="outline" className="transform transition-all duration-300 hover:scale-105">
                  Question {interviewProgress.currentQuestion} of {interviewProgress.total}
                </Badge>
              </div>
              <div className="mt-4 bg-gray-200/50 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(interviewProgress.currentQuestion / interviewProgress.total) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button onClick={handleResumeInterview} className="transform transition-all duration-300 hover:scale-105">
                <Play className="mr-3 h-5 w-5" />
                Continue Interview
              </Button>
              <Button variant="outline" onClick={handleRestartInterview} className="transform transition-all duration-300 hover:scale-105">
                <RotateCcw className="mr-3 h-5 w-5" />
                Start Over
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IntervieweeUI;