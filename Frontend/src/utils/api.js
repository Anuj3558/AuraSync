// Function to extract user ID from URL
export const getUserIdFromURL = () => {
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
export const fetchUserData = async (userId) => {
  try {
    // Simulate API call
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
export const fetchJobData = async (userId) => {
  try {
    // Simulate API call
    const jobData = {
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      department: "Engineering",
      status: "Interview Scheduled",
      appliedDate: "2024-03-15",
      description: "We are looking for a Senior Frontend Developer to join our growing engineering team..."
    };
    
    return jobData;
  } catch (error) {
    console.error('Error fetching job data:', error);
    return null;
  }
};

// API endpoints for jobs
const API_URL = 'http://localhost:5000/api';

// Create a new job posting
export const createJobPosting = async (jobData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        positionTitle: jobData.title,
        company: jobData.company,
        location: jobData.location,
        salaryRange: jobData.salary,
        experienceLevel: jobData.experience,
        skills: jobData.skills,
        jobDescription: jobData.description,
        requirements: jobData.requirements
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create job posting');
    }

    return data.data;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

// Get all job postings
export const getAllJobPostings = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/jobs`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch jobs');
    }

    return data.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

// Get a specific job posting
export const getJobPosting = async (jobId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/jobs/${jobId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch job');
    }

    return data.data;
  } catch (error) {
    console.error('Error fetching job:', error);
    throw error;
  }
};

// Update a job posting
export const updateJobPosting = async (jobId, updates) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/jobs/${jobId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        positionTitle: updates.title,
        company: updates.company,
        location: updates.location,
        salaryRange: updates.salary,
        experienceLevel: updates.experience,
        skills: updates.skills,
        jobDescription: updates.description,
        requirements: updates.requirements
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update job posting');
    }

    return data.data;
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
};

// Delete a job posting
export const deleteJobPosting = async (jobId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/jobs/${jobId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete job posting');
    }

    return data.data;
  } catch (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
};

// Get job statistics
export const getJobStats = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/jobs/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch job statistics');
    }

    return data.data;
  } catch (error) {
    console.error('Error fetching job stats:', error);
    throw error;
  }
};

// Candidate API Functions

// Create a new candidate
export const createCandidate = async (candidateData, jobId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/candidates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ...candidateData,
        jobOpeningId: jobId
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create candidate');
    }

    return data.data;
  } catch (error) {
    console.error('Error creating candidate:', error);
    throw error;
  }
};

// Get candidates for a job
export const getCandidatesForJob = async (jobId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/candidates/job/${jobId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch candidates');
    }

    return data.data;
  } catch (error) {
    console.error('Error fetching candidates:', error);
    throw error;
  }
};

// Get a specific candidate
export const getCandidate = async (candidateId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/candidates/${candidateId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch candidate');
    }

    return data.data;
  } catch (error) {
    console.error('Error fetching candidate:', error);
    throw error;
  }
};

// Update candidate status
export const updateCandidateStatus = async (candidateId, updates) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/candidates/${candidateId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updates)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update candidate status');
    }

    return data.data;
  } catch (error) {
    console.error('Error updating candidate status:', error);
    throw error;
  }
};

// Delete a candidate
export const deleteCandidate = async (candidateId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/candidates/${candidateId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete candidate');
    }

    return data.data;
  } catch (error) {
    console.error('Error deleting candidate:', error);
    throw error;
  }
};

// Get candidate statistics
export const getCandidateStats = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/candidates/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch candidate statistics');
    }

    return data.data;
  } catch (error) {
    console.error('Error fetching candidate stats:', error);
    throw error;
  }
};