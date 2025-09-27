import React, { useState, useEffect } from 'react';

// Icons (using simple SVG with Apple-style design)
const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
  </svg>
);

const BriefcaseIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
  </svg>
);

const UsersIcon = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const DollarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const PersonAddIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const StarIcon = ({ filled = false, className = "w-4 h-4" }) => (
  <svg className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

// Mock data
const initialJobs = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "Apple Inc.",
    location: "Cupertino, CA",
    salary: "$160k - $220k",
    type: "Full-time",
    experience: "Senior",
    skills: ["Swift", "Objective-C", "iOS", "macOS"],
    description: "Join our world-class engineering team to build the next generation of Apple products.",
    requirements: "5+ years of experience with iOS/macOS development",
    posted: "2 days ago",
    candidates: 24,
    status: "Active"
  },
  {
    id: 2,
    title: "Product Manager",
    company: "Meta",
    location: "Menlo Park, CA",
    salary: "$140k - $190k",
    type: "Full-time", 
    experience: "Mid-level",
    skills: ["Product Strategy", "Analytics", "Design", "Leadership"],
    description: "Drive product vision and strategy for our innovative platforms.",
    requirements: "3+ years of product management experience",
    posted: "1 week ago",
    candidates: 18,
    status: "Active"
  },
  {
    id: 3,
    title: "UX Designer",
    company: "Google",
    location: "Mountain View, CA",
    salary: "$120k - $160k",
    type: "Full-time",
    experience: "Mid-level",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
    description: "Create beautiful and intuitive user experiences for millions of users.",
    requirements: "3+ years of UX design experience",
    posted: "3 days ago",
    candidates: 31,
    status: "Active"
  }
];

const mockCandidates = [
  {
    id: 1,
    jobId: 1,
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    experience: "6 years",
    skills: ["Swift", "Objective-C", "iOS", "Python"],
    score: 92,
    status: "In Review",
    avatar: "AJ",
    resume: "Experienced software engineer with expertise in iOS development. Led multiple teams and delivered scalable applications for Fortune 500 companies...",
    chatHistory: [
      { sender: "AI", message: "Hi Alex! Thanks for applying. Can you tell me about your most challenging iOS project?" },
      { sender: "User", message: "I led the development of a real-time collaboration app with 1M+ users. We optimized it for low-latency communication using WebRTC." },
      { sender: "AI", message: "That sounds impressive! What was the biggest technical challenge you faced?" },
      { sender: "User", message: "Handling real-time sync across different device orientations and managing memory efficiently for background processing." }
    ]
  },
  {
    id: 2,
    jobId: 1,
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    phone: "+1 (555) 987-6543",
    experience: "8 years",
    skills: ["Swift", "SwiftUI", "Core Data", "CloudKit"],
    score: 88,
    status: "Interview Scheduled",
    avatar: "SC",
    resume: "Senior iOS developer with strong background in Apple ecosystem. Passionate about building scalable systems and mentoring junior developers...",
    chatHistory: [
      { sender: "AI", message: "Hello Sarah! What excites you most about this role at Apple?" },
      { sender: "User", message: "I'm excited about the opportunity to work on products that impact millions of users. Apple's attention to detail aligns perfectly with my values." },
      { sender: "AI", message: "Great! Can you share an example of when you mentored someone?" }
    ]
  }
];

const RecruitmentDashboard = () => {
  const [jobs, setJobs] = useState(initialJobs);
  const [candidates, setCandidates] = useState(mockCandidates);
  const [searchTerm, setSearchTerm] = useState("");
  const [showJobModal, setShowJobModal] = useState(false);
  const [showJobDetailModal, setShowJobDetailModal] = useState(false);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [isAddingCandidate, setIsAddingCandidate] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    experience: "",
    skills: "",
    description: "",
    requirements: ""
  });
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    skills: "",
    resume: ""
  });

  // Filter jobs based on search term
  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get candidates for a specific job
  const getCandidatesForJob = (jobId) => {
    return candidates.filter(candidate => candidate.jobId === jobId);
  };

  // Handle job creation with AI
  const handleCreateJob = async () => {
    if (!newJob.title || !newJob.company) return;
    
    setIsCreatingJob(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const job = {
      id: Math.max(...jobs.map(j => j.id)) + 1,
      ...newJob,
      skills: newJob.skills.split(',').map(s => s.trim()).filter(s => s),
      type: "Full-time",
      posted: "Just now",
      candidates: 0,
      status: "Active"
    };
    
    setJobs(prevJobs => [...prevJobs, job]);
    setIsCreatingJob(false);
    setShowJobModal(false);
    setNewJob({
      title: "",
      company: "",
      location: "",
      salary: "",
      experience: "",
      skills: "",
      description: "",
      requirements: ""
    });
  };

  // Handle adding candidate
  const handleAddCandidate = async () => {
    if (!newCandidate.name || !newCandidate.email || !selectedJob) return;
    
    setIsAddingCandidate(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const candidate = {
      id: Math.max(...candidates.map(c => c.id)) + 1,
      jobId: selectedJob.id,
      ...newCandidate,
      skills: newCandidate.skills.split(',').map(s => s.trim()).filter(s => s),
      score: Math.floor(Math.random() * 20) + 80, // Random score between 80-100
      status: "In Review",
      avatar: newCandidate.name.split(' ').map(n => n[0]).join('').toUpperCase(),
      chatHistory: []
    };
    
    setCandidates(prevCandidates => [...prevCandidates, candidate]);
    
    // Update job candidate count
    setJobs(prevJobs => prevJobs.map(job => 
      job.id === selectedJob.id 
        ? { ...job, candidates: job.candidates + 1 }
        : job
    ));
    
    setIsAddingCandidate(false);
    setShowAddCandidateModal(false);
    setNewCandidate({
      name: "",
      email: "",
      phone: "",
      experience: "",
      skills: "",
      resume: ""
    });
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setShowJobDetailModal(true);
  };

  const handleCandidateClick = (candidate) => {
    setSelectedCandidate(candidate);
    setShowCandidateModal(true);
  };

  const handleAddCandidateClick = () => {
    setShowAddCandidateModal(true);
  };

  // Reset states when modals close
  useEffect(() => {
    if (!showJobModal) {
      setNewJob({
        title: "",
        company: "",
        location: "",
        salary: "",
        experience: "",
        skills: "",
        description: "",
        requirements: ""
      });
    }
  }, [showJobModal]);

  useEffect(() => {
    if (!showAddCandidateModal) {
      setNewCandidate({
        name: "",
        email: "",
        phone: "",
        experience: "",
        skills: "",
        resume: ""
      });
    }
  }, [showAddCandidateModal]);

  return (
    <div className="min-h-screen bg-gray-50" style={{
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      <style jsx global>{`
        .apple-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .apple-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(31, 38, 135, 0.2);
        }
        
        .apple-button {
          background: linear-gradient(135deg, #007AFF 0%, #0056D3 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-weight: 600;
          padding: 12px 24px;
          transition: all 0.2s ease;
          box-shadow: 0 4px 16px rgba(0, 122, 255, 0.3);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        
        .apple-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(0, 122, 255, 0.4);
        }
        
        .apple-button:active:not(:disabled) {
          transform: translateY(0);
        }
        
        .apple-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        .apple-button-secondary {
          background: rgba(0, 122, 255, 0.1);
          border: 1px solid rgba(0, 122, 255, 0.3);
          border-radius: 12px;
          color: #007AFF;
          font-weight: 500;
          padding: 12px 24px;
          transition: all 0.2s ease;
          cursor: pointer;
        }
        
        .apple-button-secondary:hover:not(:disabled) {
          background: rgba(0, 122, 255, 0.15);
          border-color: rgba(0, 122, 255, 0.4);
        }
        
        .apple-button-secondary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .apple-input {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          padding: 14px 16px;
          font-size: 16px;
          transition: all 0.2s ease;
          width: 100%;
          box-sizing: border-box;
        }
        
        .apple-input:focus {
          outline: none;
          border-color: #007AFF;
          box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1);
          background: rgba(255, 255, 255, 0.95);
        }
        
        .apple-modal {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(40px);
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        
        .skill-tag {
          background: linear-gradient(135deg, #007AFF 0%, #0056D3 100%);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          display: inline-block;
        }
        
        .status-badge {
          background: linear-gradient(135deg, #34C759 0%, #28A745 100%);
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          display: inline-block;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-scale-in {
          animation: scaleIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { 
            opacity: 0; 
            transform: scale(0.9); 
          }
          to { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      {/* Header */}
      <header className="apple-card mx-6 mt-6 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <BriefcaseIcon className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Recruitment</h1>
              <p className="text-gray-600 text-sm">AI-powered hiring assistant</p>
            </div>
          </div>
          
          <button
            onClick={() => setShowJobModal(true)}
            className="apple-button flex items-center space-x-2"
          >
            <PlusIcon />
            <span>New Position</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="apple-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Open Positions</p>
                <p className="text-3xl font-bold text-gray-900">{jobs.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                <BriefcaseIcon className="text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="apple-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Candidates</p>
                <p className="text-3xl font-bold text-gray-900">
                  {jobs.reduce((sum, job) => sum + job.candidates, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                <UsersIcon className="text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="apple-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Success Rate</p>
                <p className="text-3xl font-bold text-gray-900">92%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                <StarIcon filled className="text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="apple-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">AI Match Score</p>
                <p className="text-3xl font-bold text-gray-900">96.8</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                <StarIcon filled className="text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="apple-card p-6 mb-8">
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search positions, companies, or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="apple-input pl-12 text-lg"
            />
          </div>
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length === 0 ? (
          <div className="apple-card p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BriefcaseIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? "No positions found" : "No positions yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? "Try adjusting your search terms" 
                : "Create your first job posting with AI assistance"
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowJobModal(true)}
                className="apple-button"
              >
                Create First Position
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="apple-card p-6 cursor-pointer"
                onClick={() => handleJobClick(job)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                      {job.title}
                    </h3>
                    <p className="text-gray-600 font-medium">{job.company}</p>
                  </div>
                  <span className="status-badge ml-2">{job.status}</span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-gray-500">
                    <LocationIcon />
                    <span className="text-sm">{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-500">
                    <DollarIcon />
                    <span className="text-sm font-medium">{job.salary}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.slice(0, 3).map((skill, idx) => (
                    <span key={idx} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                  {job.skills.length > 3 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                      +{job.skills.length - 3}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <UsersIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {job.candidates} candidates
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">{job.posted}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Job Modal */}
      {showJobModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="apple-modal max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Create New Position</h2>
                <button 
                  onClick={() => setShowJobModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Position Title</label>
                  <input
                    type="text"
                    value={newJob.title}
                    onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                    className="apple-input"
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Company</label>
                  <input
                    type="text"
                    value={newJob.company}
                    onChange={(e) => setNewJob({...newJob, company: e.target.value})}
                    className="apple-input"
                    placeholder="e.g. Apple Inc."
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Location</label>
                  <input
                    type="text"
                    value={newJob.location}
                    onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                    className="apple-input"
                    placeholder="e.g. Cupertino, CA"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Salary Range</label>
                  <input
                    type="text"
                    value={newJob.salary}
                    onChange={(e) => setNewJob({...newJob, salary: e.target.value})}
                    className="apple-input"
                    placeholder="e.g. $160k - $220k"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Experience Level</label>
                  <select
                    value={newJob.experience}
                    onChange={(e) => setNewJob({...newJob, experience: e.target.value})}
                    className="apple-input"
                  >
                    <option value="">Select experience level</option>
                    <option value="Entry-level">Entry-level (0-2 years)</option>
                    <option value="Mid-level">Mid-level (3-5 years)</option>
                    <option value="Senior">Senior (5-8 years)</option>
                    <option value="Lead">Lead (8+ years)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Skills (comma-separated)</label>
                  <input
                    type="text"
                    value={newJob.skills}
                    onChange={(e) => setNewJob({...newJob, skills: e.target.value})}
                    className="apple-input"
                    placeholder="e.g. Swift, iOS, Objective-C"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Job Description</label>
                <textarea
                  value={newJob.description}
                  onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                  className="apple-input h-24 resize-none"
                  placeholder="Describe the role and responsibilities..."
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Requirements</label>
                <textarea
                  value={newJob.requirements}
                  onChange={(e) => setNewJob({...newJob, requirements: e.target.value})}
                  className="apple-input h-24 resize-none"
                  placeholder="List the key requirements..."
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100 flex justify-end space-x-3">
              <button 
                onClick={() => setShowJobModal(false)}
                className="apple-button-secondary"
                disabled={isCreatingJob}
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateJob}
                className="apple-button flex items-center space-x-2"
                disabled={isCreatingJob || !newJob.title || !newJob.company}
              >
                {isCreatingJob && <SpinnerIcon />}
                <span>{isCreatingJob ? "Creating..." : "Create Position"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Detail Modal */}
      {showJobDetailModal && selectedJob && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="apple-modal max-w-5xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">{selectedJob.title}</h2>
                  <p className="text-gray-600">{selectedJob.company} • {selectedJob.location}</p>
                </div>
                <button 
                  onClick={() => setShowJobDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h3>
                    <div className="apple-card p-6">
                      <p className="text-gray-700 leading-relaxed">{selectedJob.description}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h3>
                    <div className="apple-card p-6">
                      <p className="text-gray-700 leading-relaxed">{selectedJob.requirements}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
                    <div className="apple-card p-6">
                      <div className="flex flex-wrap gap-3">
                        {selectedJob.skills.map((skill, idx) => (
                          <span key={idx} className="skill-tag text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="apple-card p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Position Details</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-gray-500 text-sm">Salary</p>
                        <p className="text-gray-900 font-semibold">{selectedJob.salary}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Experience</p>
                        <p className="text-gray-900 font-semibold">{selectedJob.experience}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Type</p>
                        <p className="text-gray-900 font-semibold">{selectedJob.type}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Posted</p>
                        <p className="text-gray-900 font-semibold">{selectedJob.posted}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="apple-card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Candidates ({getCandidatesForJob(selectedJob.id).length})
                      </h3>
                      <button
                        onClick={handleAddCandidateClick}
                        className="apple-button-secondary flex items-center space-x-2 text-sm px-3 py-2"
                      >
                        <PersonAddIcon />
                        <span>Add</span>
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {getCandidatesForJob(selectedJob.id).map((candidate) => (
                        <div
                          key={candidate.id}
                          className="apple-card p-4 cursor-pointer hover:shadow-lg transition-all duration-200"
                          onClick={() => handleCandidateClick(candidate)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                              {candidate.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 truncate">{candidate.name}</p>
                              <p className="text-sm text-gray-600 truncate">{candidate.experience}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-blue-600">{candidate.score}%</div>
                              <div className="text-xs text-gray-500">{candidate.status}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {getCandidatesForJob(selectedJob.id).length === 0 && (
                        <div className="text-center py-8">
                          <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                            <UsersIcon className="w-6 h-6 text-gray-400" />
                          </div>
                          <p className="text-gray-500">No candidates yet</p>
                          <button
                            onClick={handleAddCandidateClick}
                            className="apple-button mt-4 text-sm px-4 py-2"
                          >
                            Add First Candidate
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Candidate Modal */}
      {showAddCandidateModal && selectedJob && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="apple-modal max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Add Candidate</h2>
                  <p className="text-gray-600 text-sm">Adding to: {selectedJob.title}</p>
                </div>
                <button 
                  onClick={() => setShowAddCandidateModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value={newCandidate.name}
                    onChange={(e) => setNewCandidate({...newCandidate, name: e.target.value})}
                    className="apple-input"
                    placeholder="e.g. John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    value={newCandidate.email}
                    onChange={(e) => setNewCandidate({...newCandidate, email: e.target.value})}
                    className="apple-input"
                    placeholder="e.g. john.doe@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={newCandidate.phone}
                    onChange={(e) => setNewCandidate({...newCandidate, phone: e.target.value})}
                    className="apple-input"
                    placeholder="e.g. +1 (555) 123-4567"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Experience</label>
                  <input
                    type="text"
                    value={newCandidate.experience}
                    onChange={(e) => setNewCandidate({...newCandidate, experience: e.target.value})}
                    className="apple-input"
                    placeholder="e.g. 5 years"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Skills (comma-separated)</label>
                  <input
                    type="text"
                    value={newCandidate.skills}
                    onChange={(e) => setNewCandidate({...newCandidate, skills: e.target.value})}
                    className="apple-input"
                    placeholder="e.g. Swift, iOS, Objective-C"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Resume / Background</label>
                <textarea
                  value={newCandidate.resume}
                  onChange={(e) => setNewCandidate({...newCandidate, resume: e.target.value})}
                  className="apple-input h-32 resize-none"
                  placeholder="Brief summary of the candidate's background and experience..."
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-100 flex justify-end space-x-3">
              <button 
                onClick={() => setShowAddCandidateModal(false)}
                className="apple-button-secondary"
                disabled={isAddingCandidate}
              >
                Cancel
              </button>
              <button 
                onClick={handleAddCandidate}
                className="apple-button flex items-center space-x-2"
                disabled={isAddingCandidate || !newCandidate.name || !newCandidate.email}
              >
                {isAddingCandidate && <SpinnerIcon />}
                <span>{isAddingCandidate ? "Adding..." : "Add Candidate"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Detail Modal */}
      {showCandidateModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="apple-modal max-w-6xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl flex items-center justify-center font-bold text-xl">
                    {selectedCandidate.avatar}
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">{selectedCandidate.name}</h2>
                    <p className="text-gray-600">{selectedCandidate.email}</p>
                    <p className="text-gray-500 text-sm">{selectedCandidate.phone}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowCandidateModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 h-[calc(90vh-140px)]">
              {/* Resume Section */}
              <div className="p-6 border-r border-gray-100 overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile</h3>
                    <div className="apple-card p-6">
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                          <p className="text-gray-500 text-sm">Experience</p>
                          <p className="text-gray-900 font-semibold">{selectedCandidate.experience}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">AI Match Score</p>
                          <p className="text-blue-600 font-bold text-2xl">{selectedCandidate.score}%</p>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <p className="text-gray-500 text-sm mb-3">Skills Assessment</p>
                        <div className="space-y-3">
                          {selectedCandidate.skills.map((skill, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                              <span className="text-sm text-gray-900 font-medium">{skill}</span>
                              <div className="flex items-center space-x-3">
                                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                                    style={{ width: `${80 + (idx * 4)}%` }}
                                  />
                                </div>
                                <span className="text-xs text-gray-500 w-8">{80 + (idx * 4)}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-gray-500 text-sm mb-3">Background</p>
                        <p className="text-gray-700 leading-relaxed">
                          {selectedCandidate.resume}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Chat Section */}
              <div className="p-6 flex flex-col">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Interview</h3>
                
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {selectedCandidate.chatHistory.length > 0 ? (
                    selectedCandidate.chatHistory.map((message, idx) => (
                      <div 
                        key={idx} 
                        className={`flex ${message.sender === 'AI' ? 'justify-start' : 'justify-end'}`}
                      >
                        <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                          message.sender === 'AI' 
                            ? 'bg-gray-100 text-gray-900' 
                            : 'bg-blue-500 text-white'
                        }`}>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-xs font-semibold opacity-75">
                              {message.sender === 'AI' ? 'AI Recruiter' : selectedCandidate.name.split(' ')[0]}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed">{message.message}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="apple-card p-8 text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 mb-4">No interview started yet</p>
                      <button className="apple-button text-sm px-4 py-2">
                        Start AI Interview
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-3">
                  <input
                    type="text"
                    placeholder="Continue the conversation..."
                    className="apple-input flex-1"
                  />
                  <button className="apple-button px-6">Send</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruitmentDashboard;