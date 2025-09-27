import React, { useState, useEffect } from 'react';
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

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Check if token exists and validate it on component mount
  useEffect(() => {
    const checkExistingToken = async () => {
      const token = Cookies.get('token');
      
      if (token) {
        setIsValidating(true);
        try {
          // Validate existing token
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/recruiters/validate-token`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            // Token is valid, redirect to interview page
            navigate('/interviewer');
          } else {
            // Token is invalid, remove it
            Cookies.remove('token');
            Cookies.remove('recruiter');
            localStorage.removeItem('token');
            localStorage.removeItem('recruiter');
          }
        } catch (error) {
          console.error('Token validation error:', error);
          // Remove invalid tokens on error
          Cookies.remove('token');
          Cookies.remove('recruiter');
          localStorage.removeItem('token');
          localStorage.removeItem('recruiter');
        } finally {
          setIsValidating(false);
        }
      }
    };

    checkExistingToken();
  }, [navigate]);

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/recruiters/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token in cookies
      const cookieOptions = {
        expires: rememberMe ? 7 : 1, // 7 days if remember me is checked, else 1 day
        secure: import.meta.env.PROD, // Use secure cookies in production
        sameSite: 'strict'
      };

      Cookies.set('token', data.token, cookieOptions);
      Cookies.set('recruiter', JSON.stringify(data.recruiter), cookieOptions);

      // Also store in localStorage for backward compatibility
      localStorage.setItem('token', data.token);
      localStorage.setItem('recruiter', JSON.stringify(data.recruiter));

      setSuccess(true);
      
      // Show success notification and redirect to /interview
      setTimeout(() => {
        navigate('/interviewer');
      }, 2000);

    } catch (error) {
      setError(error.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while validating existing token
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}>
        <div className="w-full max-w-md animate-fade-in">
          <div className="apple-card p-8 text-center">
            <div className="flex justify-center mb-6">
              <SpinnerIcon className="text-blue-600 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Checking Authentication</h2>
            <p className="text-gray-600">Validating your session...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show success state after login
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Successful!</h2>
            <p className="text-gray-600 mb-6">You have been successfully logged in.</p>
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
        
        .apple-checkbox {
          appearance: none;
          width: 20px;
          height: 20px;
          border: 2px solid #D1D1D6;
          border-radius: 6px;
          position: relative;
          cursor: pointer;
          transition: all 0.2s ease;
          background: rgba(255, 255, 255, 0.8);
        }
        
        .apple-checkbox:checked {
          background: linear-gradient(135deg, #007AFF 0%, #0056D3 100%);
          border-color: #007AFF;
        }
        
        .apple-checkbox:checked::after {
          content: '';
          position: absolute;
          left: 6px;
          top: 3px;
          width: 4px;
          height: 8px;
          border: 2px solid white;
          border-left: none;
          border-top: none;
          transform: rotate(45deg);
        }
        
        .apple-checkbox:focus {
          outline: none;
          box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1);
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

      <div className="w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <BriefcaseIcon className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your recruitment dashboard</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="apple-card p-8">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Email Address
              </label>
              <div className="apple-input-container">
                <div className="apple-input-icon">
                  <MailIcon />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="apple-input"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Password
              </label>
              <div className="apple-input-container">
                <div className="apple-input-icon">
                  <LockIcon />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="apple-input"
                  placeholder="Enter your password"
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="apple-checkbox"
                />
                <span className="text-gray-700 font-medium">Remember me</span>
              </label>
              
              <a 
                href="#" 
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="apple-button"
              disabled={isLoading || !email || !password}
            >
              {isLoading && <SpinnerIcon className="mr-2" />}
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-gray-500 font-medium">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Alternative Actions */}
        <div className="space-y-4">
          <div className="text-center">
            <span className="text-gray-600">Don't have an account? </span>
            <a 
              href="#" 
              className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              Request Access
            </a>
          </div>
          <button
            onClick={() => navigate("/register")}
            className="apple-button-secondary"
          >
            Create an Account
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

export default LoginPage;