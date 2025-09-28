import { useEffect, useRef, useState } from "react";
import { SecurityManager } from "./securityManger";
import { SecurityAlert } from "./SecurityAlter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./Card";
import { TimeDisplay } from "./Time";
import { ChatMessage } from "./Chatmessage";
import Button from "./Button";
import { Mic, MicOff, Send, Shield, Clock } from "lucide-react";

export const ChatBox = ({ onComplete, userInfo }) => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [isTyping, setIsTyping] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [securityViolations, setSecurityViolations] = useState([]);
  const [totalInterviewTime] = useState(20 * 60); // 20 minutes total
  const [questionTime] = useState(3 * 60); // 3 minutes per question
  const [totalTimeRemaining, setTotalTimeRemaining] = useState(20 * 60);
  const [questionTimeRemaining, setQuestionTimeRemaining] = useState(3 * 60);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [interviewSession, setInterviewSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const saveTimeoutRef = useRef(null);
  const totalQuestions = 6;

  const fallbackQuestions = [
    "Can you tell me about your professional background and experience?",
    "How do you approach solving complex technical problems?",
    "Describe a challenging project you've worked on recently.",
    "What technologies are you most passionate about and why?",
    "How do you stay updated with the latest industry trends?",
    "Where do you see yourself in the next 5 years?"
  ];

  // API functions
  const baseURL = import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:5000/api';

  const initializeInterview = async () => {
    try {
      console.log('Initializing interview for user:', userInfo.id);
      
      // First, check for existing session
      const existingResponse = await fetch(`${baseURL}/interviews/user/${userInfo.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (existingResponse.ok) {
        const existingData = await existingResponse.json();
        console.log('Existing session check:', existingData);
        
        if (existingData.success && existingData.data && 
            (existingData.data.status === 'started' || existingData.data.status === 'in_progress')) {
          // Resume existing interview
          console.log('Resuming existing interview:', existingData.data.id);
          return await resumeInterview(existingData.data.id);
        }
      }

      // Create new interview session
      console.log('Creating new interview session');
      const response = await fetch(`${baseURL}/interview/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: userInfo.id,
          positionId: userInfo.position?._id || userInfo.positionId || 'default',
          recruiterId: userInfo.recruiterId || 'system'
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to start interview: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('New interview session created:', data);
      return data.data;
    } catch (error) {
      console.error('Error initializing interview:', error);
      // Return a fallback session structure for offline mode
      return {
        _id: 'offline_' + Date.now(),
        status: 'started',
        currentQuestion: 1,
        totalQuestions: 6,
        timeRemaining: totalInterviewTime,
        questionTimeRemaining: questionTime,
        conversationHistory: [],
        offline: true
      };
    }
  };

  const resumeInterview = async (interviewId) => {
    try {
      console.log('Resuming interview:', interviewId);
      const response = await fetch(`${baseURL}/interview/${interviewId}/resume`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to resume interview: ${response.status}`);
      }

      const data = await response.json();
      const session = data.data;
      console.log('Resumed session:', session);

      // Restore state from session
      setCurrentQuestion(session.currentQuestion || 1);
      setTotalTimeRemaining(session.timeRemaining || totalInterviewTime);
      setQuestionTimeRemaining(session.questionTimeRemaining || questionTime);
      
      // Restore messages from conversation history
      if (session.conversationHistory && session.conversationHistory.length > 0) {
        const restoredMessages = session.conversationHistory
          .filter(msg => msg.role !== 'system') // Filter out system messages
          .map((msg, index) => ({
            id: index + 1,
            text: msg.content,
            isUser: msg.role === 'user',
            timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isNew: false
          }));

        setMessages(restoredMessages);
      }

      return session;
    } catch (error) {
      console.error('Error resuming interview:', error);
      return null;
    }
  };

  const generateNextQuestion = async (interviewId, isOffline = false) => {
    try {
      let questionText;
      
      if (isOffline || !interviewId || interviewId.startsWith('offline_')) {
        // Use fallback questions for offline mode
        if (currentQuestion <= totalQuestions && currentQuestion <= fallbackQuestions.length) {
          questionText = fallbackQuestions[currentQuestion - 1];
        } else {
          questionText = "Thank you for your responses. That concludes our interview.";
        }
      } else {
        console.log('Generating question for interview:', interviewId);
        const response = await fetch(`${baseURL}/interview/${interviewId}/question`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
          throw new Error(`Failed to generate question: ${response.status}`);
        }

        const data = await response.json();
        questionText = data.data.question;
      }

      const questionMessage = {
        id: Date.now(),
        text: questionText,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isNew: true
      };

      setMessages(prev => [...prev, questionMessage]);
      return questionText;
    } catch (error) {
      console.error('Error generating question:', error);
      // Fallback to predefined questions
      if (currentQuestion <= totalQuestions && currentQuestion <= fallbackQuestions.length) {
        const fallbackQuestion = {
          id: Date.now(),
          text: fallbackQuestions[currentQuestion - 1],
          isUser: false,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isNew: true
        };
        setMessages(prev => [...prev, fallbackQuestion]);
        return fallbackQuestion.text;
      }
    }
  };

  const submitAnswer = async (answer) => {
    try {
      if (!interviewSession._id || interviewSession._id.startsWith('offline_') || interviewSession.offline) {
        // Handle offline mode
        console.log('Offline mode: Answer submitted:', answer);
        return {
          completed: currentQuestion >= totalQuestions,
          currentQuestion: currentQuestion + 1,
          offline: true
        };
      }

      console.log('Submitting answer for interview:', interviewSession._id);
      const response = await fetch(`${baseURL}/interview/${interviewSession._id}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          answer,
          timeRemaining: totalTimeRemaining,
          questionTimeRemaining: questionTimeRemaining
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to submit answer: ${response.status}`);
      }

      const data = await response.json();
      console.log('Answer submitted successfully:', data);
      return data.data;
    } catch (error) {
      console.error('Error submitting answer:', error);
      // Return fallback response for offline mode
      return {
        completed: currentQuestion >= totalQuestions,
        currentQuestion: currentQuestion + 1,
        offline: true
      };
    }
  };

  const saveSessionState = async () => {
    if (!interviewSession?._id || interviewSession._id.startsWith('offline_') || interviewSession.offline) {
      console.log('Skipping save for offline session');
      return;
    }

    try {
      await fetch(`${baseURL}/interview/${interviewSession._id}/save-state`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentQuestion,
          timeRemaining: totalTimeRemaining,
          questionTimeRemaining,
          messages: messages.map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.text,
            timestamp: new Date()
          })),
          status: 'in_progress'
        })
      });
      console.log('Session state saved successfully');
    } catch (error) {
      console.error('Error saving session state:', error);
    }
  };

  // Auto-save session state every 10 seconds
  const scheduleAutoSave = () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      saveSessionState();
      scheduleAutoSave(); // Schedule next save
    }, 10000); // Increased to 10 seconds to reduce server load
  };

  // Initialize interview on component mount
  useEffect(() => {
    const setupInterview = async () => {
      if (!userInfo?.id) {
        console.log('No user info available, skipping interview setup');
        setSessionLoading(false);
        return;
      }

      setSessionLoading(true);
      try {
        const session = await initializeInterview();
        
        if (session) {
          console.log('Interview session initialized:', session);
          setInterviewSession(session);
          setIsInterviewStarted(true);
          
          // If it's a new session or has no conversation history, add welcome message
          if (!session.conversationHistory?.length || session.conversationHistory.length === 0) {
            const welcomeMessage = {
              id: 1,
              text: `Hello ${userInfo?.name || 'there'}! I'm your AI interviewer for the ${userInfo?.position?.title || 'position'}. Let's begin with some questions about your background and experience. Take your time to provide thoughtful responses.`,
              isUser: false,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isNew: true
            };
            setMessages([welcomeMessage]);
            
            // Generate first question after welcome message
            setTimeout(() => {
              generateNextQuestion(session._id, session.offline);
            }, 2000);
          } else {
            // Check if we need to generate the next question
            const lastMessage = messages[messages.length - 1];
            if (!lastMessage || lastMessage.isUser) {
              // Last message was from user, generate next question
              setTimeout(() => {
                generateNextQuestion(session._id, session.offline);
              }, 1000);
            }
          }
        } else {
          console.error('Failed to initialize interview session');
          // Set up offline mode
          setInterviewSession({
            _id: 'offline_' + Date.now(),
            offline: true,
            status: 'started',
            currentQuestion: 1
          });
          setIsInterviewStarted(true);
        }
      } catch (error) {
        console.error('Error setting up interview:', error);
        setIsInterviewStarted(true); // Allow fallback mode
      } finally {
        setSessionLoading(false);
      }
    };

    setupInterview();
  }, [userInfo]);

  // Start auto-save when interview starts
  useEffect(() => {
    if (isInterviewStarted && interviewSession && !interviewSession.offline) {
      scheduleAutoSave();
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [isInterviewStarted, interviewSession, currentQuestion, totalTimeRemaining, questionTimeRemaining, messages]);

  // Security setup
  useEffect(() => {
    if (!isInterviewStarted) return;

    SecurityManager.enableFullscreen();
    
    const cleanupTabSwitch = SecurityManager.preventTabSwitch();
    
    const handleBeforeUnload = (e) => {
      saveSessionState();
      e.preventDefault();
      e.returnValue = 'Your interview progress will be saved. Are you sure you want to leave?';
      return e.returnValue;
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        setSecurityViolations(prev => [...prev, "Fullscreen mode exited. Interview requires fullscreen mode."]);
        setTimeout(() => SecurityManager.enableFullscreen(), 1000);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        saveSessionState();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cleanupTabSwitch();
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isInterviewStarted, interviewSession, currentQuestion, totalTimeRemaining, questionTimeRemaining, messages]);

  // Prevent paste in input
  useEffect(() => {
    if (inputRef.current) {
      const cleanupPaste = SecurityManager.preventPaste(inputRef);
      return cleanupPaste;
    }
  }, [inputRef.current]);

  // Timer logic
  useEffect(() => {
    let interval;
    if (isInterviewStarted && !sessionLoading) {
      interval = setInterval(() => {
        setTotalTimeRemaining(prev => {
          const newTime = prev <= 1 ? 0 : prev - 1;
          if (newTime === 0) {
            clearInterval(interval);
            handleInterviewComplete();
          }
          return newTime;
        });
        
        setQuestionTimeRemaining(prev => {
          const newTime = prev <= 1 ? 0 : prev - 1;
          if (newTime === 0 && currentQuestion < totalQuestions) {
            // Auto-advance to next question when time runs out
            setTimeout(() => {
              if (currentQuestion < totalQuestions) {
                generateNextQuestion(interviewSession._id, interviewSession?.offline);
                setCurrentQuestion(curr => curr + 1);
              }
            }, 100);
            return questionTime; // Reset for next question
          }
          return newTime;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isInterviewStarted, sessionLoading, currentQuestion, totalQuestions, questionTime, interviewSession]);

  const handleInterviewComplete = async () => {
    try {
      console.log('Completing interview...');
      
      // Mark interview as completed
      if (interviewSession?._id && !interviewSession._id.startsWith('offline_') && !interviewSession.offline) {
        await fetch(`${baseURL}/interview/${interviewSession._id}/complete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      SecurityManager.exitFullscreen();
      onComplete();
    } catch (error) {
      console.error('Error completing interview:', error);
      SecurityManager.exitFullscreen();
      onComplete();
    }
  };

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

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || sendingMessage || !interviewSession) return;

    setSendingMessage(true);

    const newMessage = {
      id: Date.now() + Math.random(),
      text: currentMessage,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isNew: true
    };

    setMessages(prev => [...prev, newMessage]);
    const userAnswer = currentMessage;
    setCurrentMessage('');

    try {
      // Submit answer to backend
      const submitResult = await submitAnswer(userAnswer);

      // Show typing indicator
      setTimeout(() => {
        setSendingMessage(false);
        setIsTyping(true);
      }, 300);

      // Process response after typing animation
      setTimeout(async () => {
        setIsTyping(false);
        
        if (submitResult?.completed || currentQuestion >= totalQuestions) {
          // Interview completed
          const finalMessage = {
            id: Date.now() + Math.random(),
            text: `Thank you for your thoughtful responses, ${userInfo?.name || 'candidate'}! That concludes our interview. Your answers have been recorded and will be reviewed by our team. You should hear back within 24-48 hours.`,
            isUser: false,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isNew: true
          };
          setMessages(prev => [...prev, finalMessage]);
          setTimeout(() => handleInterviewComplete(), 3000);
        } else {
          // Generate next question
          setCurrentQuestion(prev => prev + 1);
          await generateNextQuestion(interviewSession._id, interviewSession?.offline);
          setQuestionTimeRemaining(questionTime);
        }
      }, 1500);
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      setSendingMessage(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Loading state
  if (sessionLoading) {
    return (
      <div className="flex justify-center items-center h-[700px]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Initializing interview session...</p>
          <p className="text-sm text-gray-500">Connecting to AI interviewer...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <SecurityAlert 
        violations={securityViolations} 
        onDismiss={() => setSecurityViolations([])}
      />
      
      <Card className="h-[700px] flex flex-col shadow-2xl transform transition-all duration-500 relative overflow-hidden">
        <CardHeader className="bg-gradient-to-r h-full from-blue-50/50 to-purple-50/50 backdrop-blur-xl relative z-20">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">AI Interview Session</CardTitle>
              <CardDescription className="text-lg">
                Answer each question thoughtfully
                {interviewSession && (
                  <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                    interviewSession.offline ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {interviewSession.offline ? 'Offline Mode' : 'Session Active'}
                  </span>
                )}
              </CardDescription>
            </div>
            <TimeDisplay 
              timeRemaining={totalTimeRemaining}
              questionTimeRemaining={questionTimeRemaining}
              isActive={isInterviewStarted}
              currentQuestion={currentQuestion}
              totalQuestions={totalQuestions}
            />
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
                    <span className="text-sm text-gray-500">AI is thinking...</span>
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
                <Clock className="w-4 h-4" />
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
                ref={inputRef}
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your response... (Paste is disabled)"
                className="w-full p-4 border-0 bg-transparent resize-none focus:ring-0 focus:outline-none placeholder-gray-500 text-gray-900"
                rows={2}
                disabled={sendingMessage || isTyping || currentQuestion > totalQuestions}
                style={{ outline: 'none' }}
              />
            </div>
            <div className="flex flex-col space-y-3">
              <Button
                onClick={() => setIsRecording(!isRecording)}
                variant={isRecording ? "danger" : "secondary"}
                size="sm"
                className={`transition-all duration-300 ${isRecording ? 'animate-pulse' : ''}`}
                disabled={sendingMessage || isTyping}
              >
                {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
              <Button 
                onClick={handleSendMessage} 
                disabled={!currentMessage.trim() || sendingMessage || isTyping || currentQuestion > totalQuestions}
                className={`transition-all duration-300 ${sendingMessage ? 'animate-pulse' : ''}`}
              >
                <Send className={`h-5 w-5 transition-transform duration-300 ${sendingMessage ? 'translate-x-1' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-4 text-center text-sm text-gray-500">
            <div className="flex items-center justify-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>
                Secure interview mode active | Fullscreen required | Tab switching monitored | 
                {interviewSession?.offline ? ' Offline mode' : ' Auto-save enabled'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};