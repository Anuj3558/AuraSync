import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// Icons matching the design system
const BriefcaseIcon = ({ className = "w-8 h-8" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
  </svg>
);

const EyeIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
  </svg>
);

const MailIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LockIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const PhoneIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const UserIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const BuildingIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 8v-5m0 5h4" />
  </svg>
);

const LinkIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
  </svg>
);

const SpinnerIcon = ({ className = "w-5 h-5" }) => (
  <svg className={`${className} animate-spin`} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const CheckCircleIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    ownerName: '',
    password: '',
    confirmPassword: '',
    officialWebsite: '',
    linkedin: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateForm = () => {
    if (!formData.companyName || !formData.email || !formData.phone || 
        !formData.ownerName || !formData.password || !formData.confirmPassword) {
      setError('All required fields must be filled');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/recruiters/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: formData.companyName,
          email: formData.email,
          phone: formData.phone,
          ownerName: formData.ownerName,
          password: formData.password,
          officialWebsite: formData.officialWebsite || undefined,
          linkedin: formData.linkedin || undefined
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store token in localStorage (optional, for backward compatibility)
      localStorage.setItem('token', data.token);
      localStorage.setItem('recruiter', JSON.stringify(data.recruiter));

      // Store token in cookies with expiration (7 days)
      Cookies.set('token', data.token, { 
        expires: 7, // 7 days
        secure: true, // Use secure cookies in production
        sameSite: 'strict' // CSRF protection
      });

      // Store recruiter data in cookies as well (optional)
      Cookies.set('recruiter', JSON.stringify(data.recruiter), { 
        expires: 7,
        secure: true,
        sameSite: 'strict'
      });

      setSuccess(true);
      
      // Show success notification and redirect to /interview
      setTimeout(() => {
        navigate('/interviewer');
      }, 2000);

    } catch (error) {
      setError(error.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}>
        <div className="w-full max-w-md animate-fade-in">
          <div className="apple-card p-8 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="text-white w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
            <p className="text-gray-600 mb-6">Your account has been created successfully.</p>
            <div className="flex justify-center">
              <SpinnerIcon className="text-blue-600 w-6 h-6" />
            </div>
            <p className="text-gray-500 text-sm mt-4">Redirecting to interview dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
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
        
        .apple-button {
          background: linear-gradient(135deg, #007AFF 0%, #0056D3 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-weight: 600;
          padding: 16px 24px;
          transition: all 0.2s ease;
          box-shadow: 0 4px 16px rgba(0, 122, 255, 0.3);
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          font-size: 16px;
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
          font-weight: 600;
          padding: 16px 24px;
          transition: all 0.2s ease;
          cursor: pointer;
          width: 100%;
          font-size: 16px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        
        .apple-button-secondary:hover:not(:disabled) {
          background: rgba(0, 122, 255, 0.15);
          border-color: rgba(0, 122, 255, 0.4);
          transform: translateY(-1px);
        }
        
        .apple-input-container {
          position: relative;
        }
        
        .apple-input {
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          padding: 16px 48px 16px 48px;
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
        
        .apple-input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #8E8E93;
          pointer-events: none;
        }
        
        .apple-input-action {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #8E8E93;
          cursor: pointer;
          transition: color 0.2s ease;
        }
        
        .apple-input-action:hover {
          color: #007AFF;
        }
        
        .floating-shapes {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: -1;
        }
        
        .shape {
          position: absolute;
          border-radius: 50%;
          background: rgba(0, 122, 255, 0.1);
          animation: float 20s infinite linear;
        }
        
        .shape:nth-child(1) {
          width: 100px;
          height: 100px;
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }
        
        .shape:nth-child(2) {
          width: 60px;
          height: 60px;
          top: 60%;
          right: 15%;
          animation-delay: -5s;
          background: rgba(52, 199, 89, 0.1);
        }
        
        .shape:nth-child(3) {
          width: 80px;
          height: 80px;
          bottom: 30%;
          left: 20%;
          animation-delay: -10s;
          background: rgba(255, 149, 0, 0.1);
        }
        
        .shape:nth-child(4) {
          width: 120px;
          height: 120px;
          top: 10%;
          right: 25%;
          animation-delay: -15s;
          background: rgba(175, 82, 222, 0.1);
        }
        
        @keyframes float {
          0% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-30px) rotate(180deg);
            opacity: 0.8;
          }
          100% {
            transform: translateY(0px) rotate(360deg);
            opacity: 0.5;
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(20px);
          }
          to { 
            opacity: 1; 
            transform: translateY(0);
          }
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .error-message {
          background: rgba(255, 59, 48, 0.1);
          border: 1px solid rgba(255, 59, 48, 0.3);
          border-radius: 8px;
          padding: 12px 16px;
          color: #FF3B30;
          font-size: 14px;
          margin-bottom: 16px;
        }
      `}</style>

      {/* Floating Background Shapes */}
      <div className="floating-shapes">
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      <div className="w-full max-w-2xl animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <BriefcaseIcon className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Register your recruitment agency</p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="apple-card p-8">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Name */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Company Name *
              </label>
              <div className="apple-input-container">
                <div className="apple-input-icon">
                  <BuildingIcon />
                </div>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="apple-input"
                  placeholder="Your company name"
                  required
                />
              </div>
            </div>

            {/* Owner/Recruiter Name */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Owner/Recruiter Name *
              </label>
              <div className="apple-input-container">
                <div className="apple-input-icon">
                  <UserIcon />
                </div>
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  className="apple-input"
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Email Address *
              </label>
              <div className="apple-input-container">
                <div className="apple-input-icon">
                  <MailIcon />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="apple-input"
                  placeholder="company@example.com"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Phone Number *
              </label>
              <div className="apple-input-container">
                <div className="apple-input-icon">
                  <PhoneIcon />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="apple-input"
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Password *
              </label>
              <div className="apple-input-container">
                <div className="apple-input-icon">
                  <LockIcon />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="apple-input"
                  placeholder="At least 6 characters"
                  required
                />
                <div 
                  className="apple-input-action"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Confirm Password *
              </label>
              <div className="apple-input-container">
                <div className="apple-input-icon">
                  <LockIcon />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="apple-input"
                  placeholder="Confirm your password"
                  required
                />
                <div 
                  className="apple-input-action"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </div>
              </div>
            </div>

            {/* Official Website */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Official Website
              </label>
              <div className="apple-input-container">
                <div className="apple-input-icon">
                  <LinkIcon />
                </div>
                <input
                  type="url"
                  name="officialWebsite"
                  value={formData.officialWebsite}
                  onChange={handleChange}
                  className="apple-input"
                  placeholder="https://company.com"
                />
              </div>
            </div>

            {/* LinkedIn */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                LinkedIn Profile
              </label>
              <div className="apple-input-container">
                <div className="apple-input-icon">
                  <LinkIcon />
                </div>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  className="apple-input"
                  placeholder="https://linkedin.com/company"
                />
              </div>
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="apple-button mt-8"
            disabled={isLoading}
          >
            {isLoading && <SpinnerIcon className="mr-2" />}
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-gray-500 font-medium">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Alternative Actions */}
        <div className="space-y-4">
          <button 
            onClick={() => navigate('/login')} 
            className="apple-button-secondary"
          >
            Already have an account? Sign In
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Powered by AI • Secure & Private</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;