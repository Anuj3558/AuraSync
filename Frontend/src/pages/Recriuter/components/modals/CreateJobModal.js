// components/modals/CreateJobModal.js
import React from 'react';
import { CloseIcon, SpinnerIcon } from '../Icons';

const CreateJobModal = ({ 
  isOpen, 
  onClose, 
  newJob, 
  onNewJobChange, 
  onCreateJob, 
  isCreating 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="apple-modal max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Create New Position</h2>
            <button 
              onClick={onClose}
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
                name="title"
                value={newJob.title}
                onChange={onNewJobChange}
                className="apple-input"
                placeholder="e.g. Senior Software Engineer"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Company</label>
              <input
                type="text"
                name="company"
                value={newJob.company}
                onChange={onNewJobChange}
                className="apple-input"
                placeholder="e.g. Apple Inc."
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={newJob.location}
                onChange={onNewJobChange}
                className="apple-input"
                placeholder="e.g. Cupertino, CA"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Salary Range</label>
              <input
                type="text"
                name="salary"
                value={newJob.salary}
                onChange={onNewJobChange}
                className="apple-input"
                placeholder="e.g. $160k - $220k"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-2">Experience Level</label>
              <select
                name="experience"
                value={newJob.experience}
                onChange={onNewJobChange}
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
                name="skills"
                value={newJob.skills}
                onChange={onNewJobChange}
                className="apple-input"
                placeholder="e.g. Swift, iOS, Objective-C"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Job Description</label>
            <textarea
              name="description"
              value={newJob.description}
              onChange={onNewJobChange}
              className="apple-input h-24 resize-none"
              placeholder="Describe the role and responsibilities..."
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Requirements</label>
            <textarea
              name="requirements"
              value={newJob.requirements}
              onChange={onNewJobChange}
              className="apple-input h-24 resize-none"
              placeholder="List the key requirements..."
            />
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-100 flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="apple-button-secondary"
            disabled={isCreating}
          >
            Cancel
          </button>
          <button 
            onClick={onCreateJob}
            className="apple-button flex items-center space-x-2"
            disabled={isCreating || !newJob.title || !newJob.company}
          >
            {isCreating && <SpinnerIcon />}
            <span>{isCreating ? "Creating..." : "Create Position"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateJobModal;