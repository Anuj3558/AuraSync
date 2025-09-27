import React, { useState, useEffect } from "react"
import { NavLink, Routes, Route, useLocation } from "react-router-dom"
import Home from "./pages/Home/Home"
import IntervieweeUI from "./pages/Candidate/Interviewer"
import RecruitmentDashboard from "./pages/Recriuter/Interviewee"
import LoginPage from "./pages/Auth/Login"
import RegisterPage from "./pages/Auth/Signup"

// Mock components for demonstration


// Page transition wrapper component
function PageTransition({ children }) {
  const location = useLocation()
  const [displayLocation, setDisplayLocation] = useState(location)
  const [transitionStage, setTransitionStage] = useState("fadeIn")

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage("fadeOut")
    }
  }, [location, displayLocation])

  return (
    <div
      className={`transition-all duration-500 ease-out ${
        transitionStage === "fadeOut" 
          ? "opacity-0 transform translate-y-4 scale-95" 
          : "opacity-100 transform translate-y-0 scale-100"
      }`}
      onTransitionEnd={() => {
        if (transitionStage === "fadeOut") {
          setDisplayLocation(location)
          setTransitionStage("fadeIn")
        }
      }}
    >
      {children}
    </div>
  )
}

// Navigation component
function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
          isActive 
            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25" 
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        }`
      }
    >
      {label}
    </NavLink>
  )
}

// Main App component
export default function App() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="text-xl font-bold text-gray-900">
                InterviewPro
              </div>
              <div className="hidden md:flex items-center space-x-2">
                <NavItem to="/" label="Home" />
                <NavItem to="/interviewee" label="Candidate" />
                <NavItem to="/interviewer" label="Recruiter" />
              </div>
            </div>
            <div className="flex items-center">
              <NavItem to="/login" label="Sign In" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content with Transitions */}
      <main className="relative overflow-hidden">
        <PageTransition key={location.pathname}>
          <div className="min-h-[calc(100vh-4rem)]">
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/interviewee" element={<IntervieweeUI />} />
              <Route path="/interviewer" element={<RecruitmentDashboard />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

            </Routes>
          </div>
        </PageTransition>
      </main>
    </div>
  )
}