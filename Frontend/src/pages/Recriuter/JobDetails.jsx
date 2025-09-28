import { UsersIcon } from "lucide-react";
import { CloseIcon, PersonAddIcon } from "./icons";

export const JobDetailModal = ({ job, candidates, onClose, onEdit, onDelete, onAddCandidate, onCandidateClick }) => (
  <div className="fixed inset-0 bg-black/50 bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
    <div className="apple-modal max-w-5xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">{job.title}</h2>
            <p className="text-gray-600">{job.company} • {job.location}</p>
          </div>
          <button 
            onClick={onClose}
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
                <p className="text-gray-700 leading-relaxed">{job.description}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h3>
              <div className="apple-card p-6">
                <p className="text-gray-700 leading-relaxed">{job.requirements}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
              <div className="apple-card p-6">
                <div className="flex flex-wrap gap-3">
                  {job.skills.map((skill, idx) => (
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
                  <p className="text-gray-900 font-semibold">{job.salary}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Experience</p>
                  <p className="text-gray-900 font-semibold">{job.experience}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Type</p>
                  <p className="text-gray-900 font-semibold">{job.type}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Posted</p>
                  <p className="text-gray-900 font-semibold">{job.posted}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Status</p>
                  <p className="text-gray-900 font-semibold">{job.status}</p>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => onEdit(job)}
                  className="apple-button-secondary flex-1 text-center"
                >
                  Edit Position
                </button>
                <button
                  onClick={() => onDelete(job.id)}
                  className="apple-button-delete flex-1 text-center"
                >
                  Delete
                </button>
              </div>
            </div>
            
            <div className="apple-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Candidates ({candidates.length})
                </h3>
                <button
                  onClick={onAddCandidate}
                  className="apple-button-secondary flex items-center space-x-2 text-sm px-3 py-2"
                >
                  <PersonAddIcon />
                  <span>Add</span>
                </button>
              </div>
              
              <div className="space-y-3">
                {candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="apple-card p-4 cursor-pointer hover:shadow-lg transition-all duration-200"
                    onClick={() => onCandidateClick(candidate)}
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
                {console.log(candidates)}
                {candidates.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <UsersIcon className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500">No candidates yet</p>
                    <button
                      onClick={onAddCandidate}
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
);