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