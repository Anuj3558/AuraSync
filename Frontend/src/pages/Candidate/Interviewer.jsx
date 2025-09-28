import React, { useState, useEffect, useRef } from 'react';
import { Brain, ArrowLeft, Play, RotateCcw, Upload, FileText, CheckCircle, MessageSquare, Send, Mic, MicOff, User, Briefcase, Mail, Phone, AlertTriangle, Clock, Shield, Badge, X, Check, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card';
import Button from './Button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './Dialog';
import { UserDetailsCard } from './userDetails';
import { ResumeUpload } from './ResumeUpload';
import { ChatBox } from './Chatbox';

// Popover Component for Link Status
const LinkStatusPopover = ({ isOpen, onClose, linkStatus, userName }) => {
  if (!isOpen) return null;

  const getStatusContent = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'verified':
        return {
          icon: <CheckCircle className="h-8 w-8 text-green-600" />,
          title: `Welcome Back, ${userName}!`,
          message: "Your account is verified and ready. You can continue with your interview assessment.",
          bgColor: "from-green-50 to-emerald-50",
          borderColor: "border-green-200",
          buttonText: "Continue Interview",
          buttonColor: "bg-green-600 hover:bg-green-700",
          showContent: true
        };
      case 'resumeprocess':
        return {
          icon: <Play className="h-8 w-8 text-blue-600" />,
          title: `Welcome Back, ${userName}!`,
          message: "Your resume has been processed and we're ready to continue with your interview. Let's pick up where you left off!",
          bgColor: "from-blue-50 to-indigo-50",
          borderColor: "border-blue-200",
          buttonText: "Resume Interview",
          buttonColor: "bg-blue-600 hover:bg-blue-700",
          showContent: true
        };
      case 'linkopened':
        return {
          icon: <FileText className="h-8 w-8 text-purple-600" />,
          title: `Hello, ${userName}!`,
          message: "Welcome back! We see you've accessed your interview link before. You can now upload your resume to begin the assessment process.",
          bgColor: "from-purple-50 to-violet-50",
          borderColor: "border-purple-200",
          buttonText: "Upload Resume",
          buttonColor: "bg-purple-600 hover:bg-purple-700",
          showContent: true
        };
      case 'completed':
        return {
          icon: <CheckCircle className="h-8 w-8 text-green-600" />,
          title: `Thank You, ${userName}!`,
          message: "You have already completed this interview assessment. Your results have been submitted to the hiring team.",
          bgColor: "from-green-50 to-emerald-50",
          borderColor: "border-green-200",
          buttonText: "View Results",
          buttonColor: "bg-green-600 hover:bg-green-700",
          showContent: true
        };
      case 'notopened':
        return {
          icon: <AlertCircle className="h-8 w-8 text-amber-600" />,
          title: `Welcome, ${userName}!`,
          message: "This is your first time accessing this interview link. Please proceed to upload your resume and begin the assessment.",
          bgColor: "from-amber-50 to-yellow-50",
          borderColor: "border-amber-200",
          buttonText: "Get Started",
          buttonColor: "bg-amber-600 hover:bg-amber-700",
          showContent: true
        };
      case 'pending':
      case 'unverified':
        return {
          icon: <Clock className="h-8 w-8 text-yellow-600" />,
          title: "Account Verification Pending",
          message: "Your account verification is in progress. You can still proceed with the interview, but some features may be limited until verification is complete.",
          bgColor: "from-yellow-50 to-amber-50",
          borderColor: "border-yellow-200",
          buttonText: "Proceed Anyway",
          buttonColor: "bg-yellow-600 hover:bg-yellow-700",
          showContent: true
        };
      case 'expired':
      case 'inactive':
        return {
          icon: <AlertTriangle className="h-8 w-8 text-red-600" />,
          title: "Account Link Expired",
          message: "Your interview link has expired. Please contact the hiring team for a new invitation link or request account reactivation.",
          bgColor: "from-red-50 to-rose-50",
          borderColor: "border-red-200",
          buttonText: "Contact Support",
          buttonColor: "bg-red-600 hover:bg-red-700",
          showContent: false // Hide main content for expired links
        };
      case 'suspended':
      case 'blocked':
        return {
          icon: <Shield className="h-8 w-8 text-red-600" />,
          title: "Account Access Restricted",
          message: "Your account access has been temporarily restricted. Please contact the hiring team for assistance.",
          bgColor: "from-red-50 to-rose-50",
          borderColor: "border-red-200",
          buttonText: "Contact Support",
          buttonColor: "bg-red-600 hover:bg-red-700",
          showContent: false // Hide main content for suspended/blocked links
        };
      default:
        return {
          icon: <AlertCircle className="h-8 w-8 text-blue-600" />,
          title: `Hello, ${userName}!`,
          message: "Welcome to your interview assessment. Please proceed to begin your evaluation.",
          bgColor: "from-blue-50 to-indigo-50",
          borderColor: "border-blue-200",
          buttonText: "Begin Interview",
          buttonColor: "bg-blue-600 hover:bg-blue-700",
          showContent: true
        };
    }
  };

  const statusContent = getStatusContent(linkStatus);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`bg-gradient-to-br ${statusContent.bgColor} rounded-3xl border-2 ${statusContent.borderColor} shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100 opacity-100`}>
        {/* Close Button - Only show for non-restricted statuses */}
        {statusContent.showContent && (
          <div className="flex justify-end p-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className={`${statusContent.showContent ? 'px-8 pb-8 -mt-4' : 'p-8'}`}>
          <div className="text-center space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="p-4 bg-white/60 backdrop-blur-sm rounded-2xl">
                {statusContent.icon}
              </div>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-900">
              {statusContent.title}
            </h3>

            {/* Message */}
            <p className="text-gray-700 leading-relaxed">
              {statusContent.message}
            </p>

            {/* Action Button - Only show for non-restricted statuses */}
            {statusContent.showContent && (
              <Button 
                onClick={onClose}
                className={`w-full ${statusContent.buttonColor} text-white font-medium py-3 px-6 rounded-xl transform transition-all duration-200 hover:scale-105`}
              >
                {statusContent.buttonText}
              </Button>
            )}

            {/* Additional Status Info */}
            {linkStatus && statusContent.showContent && (
              <div className="mt-4 p-3 bg-white/40 backdrop-blur-sm rounded-lg">
                <p className="text-sm text-gray-600">
                  Link Status: <span className="font-semibold capitalize">{linkStatus}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component with enhanced animations
const IntervieweeUI = () => {
  const [currentStep, setCurrentStep] = useState('loading');
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const [showLinkStatusPopover, setShowLinkStatusPopover] = useState(false);
  const [candidateInfo, setCandidateInfo] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [jobInfo, setJobInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [interviewProgress, setInterviewProgress] = useState({ currentQuestion: 1, total: 6 });
  const [pageTransition, setPageTransition] = useState(false);

  // Function to extract user ID from URL
  const getUserIdFromURL = () => {
    const pathname = window.location.pathname; 
    const userId = pathname.split("/").pop(); 
    
    if (!userId) {
      const pathParts = window.location.pathname.split('/');
      const userIdFromPath = pathParts[pathParts.length - 1];
      if (userIdFromPath && !isNaN(userIdFromPath)) {
        return userIdFromPath;
      }
    }
    
    return userId || 'demo123';
  };

  // Function to fetch user data from backend
  const fetchUserData = async (userId) => {
    try {
      const baseURL = import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token') || Cookies.get('token');
      
      const response = await fetch(`${baseURL}/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      
      console.log('User Data Response:', response);
      if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle different response structures
      const userData = data.data || data;
      console.log(userData)
      return {
        id: userData._id || userData.id || userId,
        name: userData.name || "Sarah Johnson",
        email: userData.email || "sarah.johnson@email.com",
        phone: userData.phone || "+1 (555) 987-6543",
        linkStatus: userData.linkStatus || 'notOpened',
        ...userData
      };
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      
      // Fallback to mock data if API fails
      return {
        id: userId,
        name: "Sarah Johnson",
        email: "sarah.johnson@email.com",
        phone: "+1 (555) 987-6543",
        linkStatus: 'notOpened'
      };
    }
  };

  // Function to fetch job data from backend
  const fetchJobData = async (userId) => {
    try {
      const baseURL = import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token') || Cookies.get('token');
      
      const response = await fetch(`${baseURL}/postion/userDetails/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (response.ok) {
        const data = await response.json();
        const jobData = data.data || data;
        
        if (jobData && jobData.length > 0) {
          const primaryJob = Array.isArray(jobData) ? jobData[0] : jobData;
          
          return {
            title: primaryJob.title || "Senior Frontend Developer",
            company: primaryJob.company || "TechCorp Inc.",
            department: primaryJob.department || "Engineering",
            status: primaryJob.status || "Interview Scheduled",
            appliedDate: primaryJob.appliedDate || "2024-03-15",
            description: primaryJob.description || "We are looking for a Senior Frontend Developer to join our growing engineering team. The ideal candidate will have 5+ years of experience with React, TypeScript, and modern web technologies. You'll be responsible for building user-facing applications, collaborating with designers and backend developers, and mentoring junior team members.",
            location: primaryJob.location || "Remote",
            salaryRange: primaryJob.salaryRange || "$120k - $160k",
            experienceLevel: primaryJob.experienceLevel || "Senior",
            skills: primaryJob.skills || ["React", "TypeScript", "JavaScript"]
          };
        }
      }
      
      return {
        title: "Senior Frontend Developer",
        company: "TechCorp Inc.",
        department: "Engineering",
        status: "Interview Scheduled",
        appliedDate: "2024-03-15",
        description: "We are looking for a Senior Frontend Developer to join our growing engineering team. The ideal candidate will have 5+ years of experience with React, TypeScript, and modern web technologies. You'll be responsible for building user-facing applications, collaborating with designers and backend developers, and mentoring junior team members.",
        location: "Remote",
        salaryRange: "$120k - $160k",
        experienceLevel: "Senior",
        skills: ["React", "TypeScript", "JavaScript"]
      };
      
    } catch (error) {
      console.error('Error fetching job data:', error);
      
      return {
        title: "Senior Frontend Developer",
        company: "TechCorp Inc.",
        department: "Engineering",
        status: "Interview Scheduled",
        appliedDate: "2024-03-15",
        description: "We are looking for a Senior Frontend Developer to join our growing engineering team. The ideal candidate will have 5+ years of experience with React, TypeScript, and modern web technologies. You'll be responsible for building user-facing applications, collaborating with designers and backend developers, and mentoring junior team members.",
        location: "Remote",
        salaryRange: "$120k - $160k",
        experienceLevel: "Senior",
        skills: ["React", "TypeScript", "JavaScript"]
      };
    }
  };

  // Function to check for existing interview session
  const checkExistingSession = async (userId) => {
    try {
      const baseURL = import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:5000/api';
      const token = localStorage.getItem('token') || Cookies.get('token');
      
      const response = await fetch(`${baseURL}/interviews/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (response.ok) {
        const data = await response.json();
        const interviews = data.data || data;
        
        const unfinishedInterview = Array.isArray(interviews) 
          ? interviews.find(interview => interview.status === 'in_progress' || interview.status === 'started')
          : null;
          
        return unfinishedInterview;
      }
      
      return null;
    } catch (error) {
      console.error('Error checking existing session:', error);
      return null;
    }
  };

  // Function to determine initial step based on link status
  const getInitialStepFromLinkStatus = (linkStatus) => {
    switch (linkStatus?.toLowerCase()) {
      case 'resumeprocess':
        return 'interview';
      case 'completed':
        return 'complete';
      case 'linkopened':
        return 'upload';
      case 'notopened':
      default:
        return 'upload';
    }
  };

  // Check if link status is restricted (should only show popover)
  const isRestrictedLinkStatus = (linkStatus) => {
    const restrictedStatuses = ['expired', 'inactive', 'suspended', 'blocked'];
    return restrictedStatuses.includes(linkStatus?.toLowerCase());
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      
      try {
        // Extract user ID from URL
        const userId = getUserIdFromURL();
        console.log('Extracted User ID:', userId);
        
        // Fetch user and job data in parallel
        const [userData, jobData, existingSession] = await Promise.all([
          fetchUserData(userId),
          fetchJobData(userId),
          checkExistingSession(userId)
        ]);
        
        setUserInfo(userData);
        const jobdata = userData.position
        console.log('Fetched Job Data:', jobdata);  
        setJobInfo(userData.position);
        
        // Check if link status is restricted
        if (isRestrictedLinkStatus(userData.linkStatus)) {
          // For restricted statuses, only show the popover and don't load any other content
          setShowLinkStatusPopover(true);
          setCurrentStep('restricted');
        } else {
          // For non-restricted statuses, show popover and load normal content
          setTimeout(() => {
            setShowLinkStatusPopover(true);
          }, 1000);
          
          // Determine initial step based on link status
          const initialStep = getInitialStepFromLinkStatus(userData.linkStatus);
          
          // Handle resumeProcess status
          if (userData.linkStatus?.toLowerCase() === 'resumeprocess') {
            setCandidateInfo({
              name: userData.name,
              email: userData.email,
              phone: userData.phone,
            });
          }
          
          // Check for existing session
          if (existingSession && initialStep !== 'complete') {
            setShowWelcomeBack(true);
            setInterviewProgress({
              currentQuestion: existingSession.currentQuestion || 1,
              total: existingSession.totalQuestions || 6
            });
          } else {
            setCurrentStep(initialStep);
          }
        }
      } catch (error) {
        console.error('Error initializing data:', error);
        setCurrentStep('upload');
      } finally {
        setLoading(false);
      }
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

  const handleCloseLinkStatusPopover = () => {
    setShowLinkStatusPopover(false);
    
    // For restricted statuses, don't allow closing the popover
    const linkStatus = userInfo?.linkStatus?.toLowerCase();
    if (isRestrictedLinkStatus(linkStatus)) {
      setShowLinkStatusPopover(true); // Keep it open
    }
  };

  const renderStepContent = () => {
    // If link status is restricted, don't show any content (only popover)
    if (isRestrictedLinkStatus(userInfo?.linkStatus)) {
      return null;
    }

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
      {/* Animated Background Elements - Only show for non-restricted statuses */}
      {!isRestrictedLinkStatus(userInfo?.linkStatus) && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/5 to-purple-400/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
      )}

      {/* Main Content - Only show for non-restricted statuses */}
      {!isRestrictedLinkStatus(userInfo?.linkStatus) && (
        <main className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
          {renderStepContent()}
        </main>
      )}

      {/* Link Status Popover */}
      <LinkStatusPopover 
        isOpen={showLinkStatusPopover && !loading} 
        onClose={handleCloseLinkStatusPopover}
        linkStatus={userInfo?.linkStatus}
        userName={userInfo?.name}
      />

      {/* Enhanced Welcome Back Dialog - Only show for non-restricted statuses */}
      {!isRestrictedLinkStatus(userInfo?.linkStatus) && (
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
      )}
    </div>
  );
};

export default IntervieweeUI;