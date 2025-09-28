// components/RecruitmentDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './this.css';
import Cookies from 'js-cookie';
// Icons (using simple SVG with Apple-style design)
import { JobDetailModal } from './JobDetails';
import { AddCandidateModal } from './AddCandidate';
import { CandidateDetailModal } from './CandidateDetails';
import {
  PlusIcon,
  SearchIcon,
  FilterIcon,
  BriefcaseIcon,
  UsersIcon,
  LocationIcon,
  DollarIcon,
  CloseIcon,
  PersonAddIcon,
  SpinnerIcon,
  StarIcon,
} from "./icons"; // adjust path as per your project
import { DeleteIcon, EditIcon } from 'lucide-react';

// API Service
const createAPIService = () => {
  const baseURL = import.meta.VITE_APP_BACKEND_URL || 'https://aurasync.onrender.com/api';
  
  const api = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add auth token to requests
  api.interceptors.request.use((config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
          Cookies.remove('token');
          Cookies.remove('recruiter');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return {
    // Positions
    getPositions: (params) => api.get('/positions', { params }),
    getPosition: (id) => api.get(`/positions/${id}`),
    createPosition: (data) => api.post('/positions', data),
    updatePosition: (id, data) => api.put(`/positions/${id}`, data),
    deletePosition: (id) => api.delete(`/positions/${id}`),

    // Candidates
    getCandidates: (jobId) => api.get(`/positions/${jobId}/candidates`),
    createCandidate: (jobId, data) => api.post(`/positions/${jobId}/candidates`, data),
    updateCandidate: (id, data) => api.put(`/candidates/${id}`, data),
    deleteCandidate: (id) => api.delete(`/candidates/${id}`),
  };
};

const RecruitmentDashboard = () => {
 const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showJobModal, setShowJobModal] = useState(false);
  const [showJobDetailModal, setShowJobDetailModal] = useState(false);
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [isAddingCandidate, setIsAddingCandidate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const API = createAPIService();

  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    location: "",
    salaryRange: "",
    experienceLevel: "",
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

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  // Fetch jobs from backend
  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const response = await API.getPositions({ search: searchTerm });
      const transformedJobs = response.data.data.map(job => ({
        id: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salaryRange,
        experience: job.experienceLevel,
        skills: job.skills || [],
        description: job.description,
        requirements: job.requirements,
        type: "Full-time",
        posted: formatDate(job.createdAt),
        candidates: job.candidatesCount || 0,
        status: job.status || "Active",
        createdAt: job.createdAt
      }));
      setJobs(transformedJobs);
      setError(null);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to load jobs. Using demo data.');
      // Fallback to demo data
      setJobs();
    } finally {
      setIsLoading(false);
    }
  };

  // Demo data fallback
const filteredJobs = jobs.filter(job => {
    const searchLower = searchTerm.toLowerCase();
    return (
      job.title.toLowerCase().includes(searchLower) ||
      job.company.toLowerCase().includes(searchLower) ||
      job.location.toLowerCase().includes(searchLower) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchLower))
    );
  });

  // Create new job
  const handleCreateJob = async () => {
    if (!newJob.title || !newJob.company || !newJob.location || !newJob.description) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setIsCreatingJob(true);
      setError(null);

      const jobData = {
        title: newJob.title,
        company: newJob.company,
        location: newJob.location,
        salaryRange: newJob.salary,
        experienceLevel: newJob.experience,
        skills: newJob.skills.split(',').map(s => s.trim()).filter(s => s),
        description: newJob.description,
        requirements: newJob.requirements
      };

      const response = await API.createPosition(jobData);
      
      const createdJob = {
        id: response.data.data._id,
        title: response.data.data.title,
        company: response.data.data.company,
        location: response.data.data.location,
        salary: response.data.data.salaryRange,
        experience: response.data.data.experienceLevel,
        skills: response.data.data.skills,
        description: response.data.data.description,
        requirements: response.data.data.requirements,
        type: "Full-time",
        posted: "Just now",
        candidates: 0,
        status: "Active",
        createdAt: response.data.data.createdAt
      };

      setJobs(prevJobs => [createdJob, ...prevJobs]);
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
      setSuccess('Position created successfully!');
    } catch (error) {
      console.error('Error creating job:', error);
      setError(error.response?.data?.message || 'Failed to create job. Please try again.');
    } finally {
      setIsCreatingJob(false);
    }
  };

  // Update job
  const handleUpdateJob = async () => {
    if (!selectedJob || !newJob.title || !newJob.company || !newJob.location || !newJob.description) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setIsCreatingJob(true);
      setError(null);

      const jobData = {
        title: newJob.title,
        company: newJob.company,
        location: newJob.location,
        salaryRange: newJob.salary,
        experienceLevel: newJob.experience,
        skills: newJob.skills.split(',').map(s => s.trim()).filter(s => s),
        description: newJob.description,
        requirements: newJob.requirements
      };

      const response = await API.updatePosition(selectedJob.id, jobData);
      
      const updatedJob = {
        ...selectedJob,
        title: response.data.data.title,
        company: response.data.data.company,
        location: response.data.data.location,
        salary: response.data.data.salaryRange,
        experience: response.data.data.experienceLevel,
        skills: response.data.data.skills,
        description: response.data.data.description,
        requirements: response.data.data.requirements
      };

      setJobs(prevJobs => prevJobs.map(job => job.id === selectedJob.id ? updatedJob : job));
      setSelectedJob(updatedJob);
      setShowJobModal(false);
      setEditMode(false);
      setSuccess('Position updated successfully!');
    } catch (error) {
      console.error('Error updating job:', error);
      setError(error.response?.data?.message || 'Failed to update job. Please try again.');
    } finally {
      setIsCreatingJob(false);
    }
  };

  // Delete job
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this position?')) {
      return;
    }

    try {
      await API.deletePosition(jobId);
      setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
      if (selectedJob && selectedJob.id === jobId) {
        setShowJobDetailModal(false);
        setSelectedJob(null);
      }
      setSuccess('Position deleted successfully!');
    } catch (error) {
      console.error('Error deleting job:', error);
      setError(error.response?.data?.message || 'Failed to delete job. Please try again.');
    }
  };

  // Fetch candidates for a job
// Fetch candidates for a job - UPDATED VERSION
const fetchCandidates = async (jobId) => {
  try {
    const response = await API.getCandidates(jobId);
    
    // Debug: log the actual response structure
    console.log('Candidates API Response:', response);
    
    // Handle different possible response structures
    const candidatesData = response?.data?.data || response?.data || [];
    
    const transformedCandidates = candidatesData.map(candidate => ({
      id: candidate._id || candidate.id,
      jobId: jobId,
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone || '',
      experience: candidate.experience || '',
      skills: Array.isArray(candidate.skills) ? candidate.skills : 
              (candidate.skills || '').split(',').map(s => s.trim()).filter(s => s),
      score: candidate.score || Math.floor(Math.random() * 20) + 80,
      status: candidate.status || 'In Review',
      avatar: candidate.name ? candidate.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'CN',
      resume: candidate.resume || '',
      chatHistory: candidate.chatHistory || []
    }));
    
    setCandidates(prev => {
      // Remove existing candidates for this job and add new ones
      const filtered = prev.filter(c => c.jobId !== jobId);
      return [...filtered, ...transformedCandidates];
    });
    
  } catch (error) {
    console.error('Error fetching candidates:', error);
    
    // Better fallback with proper jobId mapping
    const fallbackCandidate = {
      id: Date.now(), // temporary ID
      jobId: jobId,
      name: "Alex Johnson",
      email: "alex.johnson@email.com",
      phone: "+1 (555) 123-4567",
      experience: "6 years",
      skills: ["Swift", "Objective-C", "iOS", "Python"],
      score: 92,
      status: "In Review",
      avatar: "AJ",
      resume: "Experienced software engineer with expertise in iOS development.",
      chatHistory: []
    };
    
    setCandidates(prev => {
      const filtered = prev.filter(c => c.jobId !== jobId);
      return [...filtered, fallbackCandidate];
    });
  }
};

  // Add candidate
  const handleAddCandidate = async () => {
    if (!newCandidate.name || !newCandidate.email || !selectedJob) {
      setError('Please fill in name and email fields');
      return;
    }

    try {
      setIsAddingCandidate(true);
      setError(null);

      const candidateData = {
        name: newCandidate.name,
        email: newCandidate.email,
        phone: newCandidate.phone,
        experience: newCandidate.experience,
        skills: newCandidate.skills.split(',').map(s => s.trim()).filter(s => s),
        resume: newCandidate.resume
      };

      const response = await API.createCandidate(selectedJob.id, candidateData);
      
      const newCandidateWithId = {
        ...response.data.data,
        avatar: newCandidate.name.split(' ').map(n => n[0]).join('').toUpperCase(),
        score: Math.floor(Math.random() * 20) + 80,
        chatHistory: []
      };

      setCandidates(prev => [...prev, newCandidateWithId]);
      setJobs(prevJobs => prevJobs.map(job => 
        job.id === selectedJob.id 
          ? { ...job, candidates: job.candidates + 1 }
          : job
      ));
      
      setShowAddCandidateModal(false);
      setNewCandidate({
        name: "",
        email: "",
        phone: "",
        experience: "",
        skills: "",
        resume: ""
      });
      setSuccess('Candidate added successfully!');
    } catch (error) {
      console.error('Error adding candidate:', error);
      setError(error.response?.data?.message || 'Failed to add candidate. Please try again.');
    } finally {
      setIsAddingCandidate(false);
    }
  };

  // Edit job handler
  const handleEditJob = (job) => {
    setSelectedJob(job);
    setNewJob({
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      experience: job.experience,
      skills: job.skills.join(', '),
      description: job.description,
      requirements: job.requirements
    });
    setEditMode(true);
    setShowJobModal(true);
  };

  // Get candidates for a specific job
// Get candidates for a specific job - UPDATED VERSION
const getCandidatesForJob = (jobId) => {
  return candidates.filter(candidate => candidate.jobId === jobId);
};

  const handleJobClick = (job) => {
    setSelectedJob(job);
    fetchCandidates(job.id);
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
      setEditMode(false);
      setError(null);
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
      setError(null);
    }
  }, [showAddCandidateModal]);

  // Auto-hide messages
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Load jobs on component mount and search term change
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchJobs();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50 recruitment-dashboard">
      {/* Notifications */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded-lg shadow-lg z-50 max-w-md">
          <div className="flex items-center justify-between">
            <span className="block sm:inline">{error}</span>
            <button 
              onClick={() => setError(null)}
              className="ml-4 text-red-700 hover:text-red-900"
            >
              <CloseIcon />
            </button>
          </div>
        </div>
      )}

      {success && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-6 py-3 rounded-lg shadow-lg z-50 max-w-md">
          <div className="flex items-center justify-between">
            <span className="block sm:inline">{success}</span>
            <button 
              onClick={() => setSuccess(null)}
              className="ml-4 text-green-700 hover:text-green-900"
            >
              <CloseIcon />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="apple-card mx-6 mt-6 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <BriefcaseIcon className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Recruitment Dashboard</h1>
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
                  {jobs.reduce((sum, job) => sum + (job.candidates || 0), 0)}
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
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Search positions, companies, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="apple-input pl-12 text-lg w-full"
              />
            </div>
            <button className="apple-button-secondary flex items-center space-x-2 px-6">
              <FilterIcon />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="apple-card p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <SpinnerIcon />
            </div>
            <p className="text-gray-600">Loading positions...</p>
          </div>
        )}

        {/* Jobs Grid */}
        {!isLoading && filteredJobs.length === 0 ? (
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
          !isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="apple-card p-6 cursor-pointer hover:shadow-lg transition-all duration-200"
                  onClick={() => handleJobClick(job)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                        {job.title}
                      </h3>
                      <p className="text-gray-600 font-medium">{job.company}</p>
                    </div>
                    <span className={`status-badge ml-2 ${job.status === 'Active' ? 'status-active' : 'status-inactive'}`}>
                      {job.status}
                    </span>
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
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-400">{job.posted}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditJob(job);
                        }}
                        className="text-blue-500 hover:text-blue-700 p-1"
                        title="Edit position"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteJob(job.id);
                        }}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete position"
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </main>

      {/* Create/Edit Job Modal */}
      {showJobModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="apple-modal max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editMode ? 'Edit Position' : 'Create New Position'}
                </h2>
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
                  <label className="block text-gray-700 font-medium mb-2">
                    Position Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newJob.title}
                    onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                    className="apple-input"
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Company <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newJob.company}
                    onChange={(e) => setNewJob({...newJob, company: e.target.value})}
                    className="apple-input"
                    placeholder="e.g. Apple Inc."
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
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
                <label className="block text-gray-700 font-medium mb-2">
                  Job Description <span className="text-red-500">*</span>
                </label>
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

              <div className="text-sm text-gray-500">
                <span className="text-red-500">*</span> Required fields
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
                onClick={editMode ? handleUpdateJob : handleCreateJob}
                className="apple-button flex items-center space-x-2"
                disabled={isCreatingJob || !newJob.title || !newJob.company || !newJob.location || !newJob.description}
              >
                {isCreatingJob && <SpinnerIcon />}
                <span>{isCreatingJob ? "Saving..." : editMode ? "Update Position" : "Create Position"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Detail Modal */}
      {showJobDetailModal && selectedJob && (
        <JobDetailModal 
          job={selectedJob}
          candidates={getCandidatesForJob(selectedJob.id)}
          onClose={() => setShowJobDetailModal(false)}
          onEdit={handleEditJob}
          onDelete={handleDeleteJob}
          onAddCandidate={handleAddCandidateClick}
          onCandidateClick={handleCandidateClick}
        />
      )}

      {/* Add Candidate Modal */}
      {showAddCandidateModal && selectedJob && (
        <AddCandidateModal
          job={selectedJob}
          candidate={newCandidate}
          onCandidateChange={setNewCandidate}
          onAdd={handleAddCandidate}
          onClose={() => setShowAddCandidateModal(false)}
          isAdding={isAddingCandidate}
        />
      )}

      {/* Candidate Detail Modal */}
      {showCandidateModal && selectedCandidate && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          onClose={() => setShowCandidateModal(false)}
        />
      )}
    </div>
  );
};

// Job Detail Modal Component


// Add Candidate Modal Component


// Candidate Detail Modal Component


export default RecruitmentDashboard;