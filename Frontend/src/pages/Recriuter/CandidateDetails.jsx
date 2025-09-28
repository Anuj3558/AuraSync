import { CloseIcon } from "./icons";

export const CandidateDetailModal = ({ candidate, onClose }) => {
  // Helper function to render category scores
  const renderCategoryScores = (categoryScores) => {
    if (!categoryScores) return null;
    
    return Object.entries(categoryScores).map(([category, score]) => (
      <div key={category} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
        <span className="text-sm text-gray-700 capitalize">{category.replace(/([A-Z])/g, ' $1')}</span>
        <div className="flex items-center space-x-3">
          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
              style={{ width: `${score}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-gray-900 w-8">{score}%</span>
        </div>
      </div>
    ));
  };

  // Helper function to render skill scores
  const renderSkillScores = (skills) => {
    return skills.map((skill, idx) => (
      <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
        <span className="text-sm text-gray-900 font-medium">{skill.name}</span>
        <div className="flex items-center space-x-3">
          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
              style={{ width: `${skill.proficiency}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 w-8">{skill.proficiency}%</span>
        </div>
      </div>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="apple-modal max-w-6xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl flex items-center justify-center font-bold text-xl">
                {candidate.avatar}
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{candidate.name}</h2>
                <p className="text-gray-600">{candidate.email}</p>
                <p className="text-gray-500 text-sm">{candidate.phone}</p>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    Score: {candidate.score}%
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    {candidate.interviewCount} interviews
                  </span>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <CloseIcon />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 h-[calc(90vh-140px)]">
          {/* Left Column - Profile & Skills */}
          <div className="p-6 border-r border-gray-100 overflow-y-auto">
            <div className="space-y-6">
              {/* Profile Card */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile</h3>
                <div className="apple-card p-6">
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <p className="text-gray-500 text-sm">Experience</p>
                      <p className="text-gray-900 font-semibold">{candidate.experience}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Status</p>
                      <p className="text-gray-900 font-semibold capitalize">{candidate.status}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-gray-500 text-sm mb-3">Skills Assessment</p>
                    <div className="space-y-2">
                      {renderSkillScores(candidate.skills)}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-gray-500 text-sm mb-3">Background</p>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {candidate.resume}
                    </p>
                  </div>
                </div>
              </div>

              {/* Interview Results */}
              {candidate.latestInterviewResult && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Latest Interview Results</h3>
                  <div className="apple-card p-6">
                    {/* Overall Score */}
                    <div className="text-center mb-6">
                      <p className="text-gray-500 text-sm mb-2">Overall Score</p>
                      <div className="text-3xl font-bold text-blue-600">
                        {candidate.latestInterviewResult.overallScore}%
                      </div>
                    </div>

                    {/* Category Scores */}
                    <div className="mb-6">
                      <p className="text-gray-500 text-sm mb-3">Category Breakdown</p>
                      <div className="space-y-2">
                        {renderCategoryScores(candidate.latestInterviewResult.categoryScores)}
                      </div>
                    </div>

                    {/* Strengths & Weaknesses */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <p className="text-green-600 text-sm font-semibold mb-2">Strengths</p>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {candidate.latestInterviewResult.strengths.map((strength, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-green-500 mr-2">✓</span>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-red-600 text-sm font-semibold mb-2">Weaknesses</p>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {candidate.latestInterviewResult.weaknesses.map((weakness, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-red-500 mr-2">⚠</span>
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <p className="text-gray-500 text-sm font-semibold mb-2">Recommendations</p>
                      <ul className="text-sm text-gray-700 space-y-2">
                        {candidate.latestInterviewResult.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Detailed Feedback */}
                    {candidate.latestInterviewResult.detailedFeedback && (
                      <div className="mt-4">
                        <p className="text-gray-500 text-sm font-semibold mb-2">Detailed Feedback</p>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {candidate.latestInterviewResult.detailedFeedback}
                        </p>
                      </div>
                    )}

                    {/* Next Steps */}
                    {candidate.latestInterviewResult.nextSteps && candidate.latestInterviewResult.nextSteps.length > 0 && (
                      <div className="mt-4">
                        <p className="text-gray-500 text-sm font-semibold mb-2">Next Steps</p>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {candidate.latestInterviewResult.nextSteps.map((step, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-green-500 mr-2">→</span>
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Middle Column - Chat History */}
          <div className="p-6 border-r border-gray-100 flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Interview Chat History</h3>
            
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {candidate.chatHistory && candidate.chatHistory.length > 0 ? (
                candidate.chatHistory.map((message, idx) => (
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
                          {message.sender === 'AI' ? 'AI Recruiter' : candidate.name.split(' ')[0]}
                        </span>
                        {message.timestamp && (
                          <span className="text-xs opacity-60">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        )}
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
          </div>

          {/* Right Column - Interview History & Analytics */}
          <div className="p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Interview Analytics</h3>
            
            {/* Interview Statistics */}
            <div className="apple-card p-6 mb-6">
              <h4 className="font-semibold text-gray-900 mb-4">Interview Statistics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{candidate.interviewCount}</p>
                  <p className="text-sm text-gray-500">Total Interviews</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{candidate.score}%</p>
                  <p className="text-sm text-gray-500">Best Score</p>
                </div>
              </div>
            </div>

            {/* All Interview Results */}
            {candidate.interviewResults && candidate.interviewResults.length > 0 && (
              <div className="apple-card p-6">
                <h4 className="font-semibold text-gray-900 mb-4">All Interview Results</h4>
                <div className="space-y-4">
                  {candidate.interviewResults.map((result, idx) => (
                    <div key={result._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-gray-900">
                          Interview {candidate.interviewResults.length - idx}
                        </span>
                        <span className="text-lg font-bold text-blue-600">
                          {result.overallScore}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">
                        {new Date(result.createdAt).toLocaleDateString()}
                      </p>
                      <div className="text-sm text-gray-700">
                        <p className="truncate">{result.detailedFeedback.substring(0, 100)}...</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};