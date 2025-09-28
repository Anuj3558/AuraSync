import { CloseIcon, SpinnerIcon } from "./icons";

export const AddCandidateModal = ({ job, candidate, onCandidateChange, onAdd, onClose, isAdding }) => (
  <div className="fixed inset-0 bg-black/50 bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
    <div className="apple-modal max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Add Candidate</h2>
            <p className="text-gray-600 text-sm">Adding to: {job.title}</p>
          </div>
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
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={candidate.name}
              onChange={(e) => onCandidateChange({...candidate, name: e.target.value})}
              className="apple-input"
              placeholder="e.g. John Doe"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={candidate.email}
              onChange={(e) => onCandidateChange({...candidate, email: e.target.value})}
              className="apple-input"
              placeholder="e.g. john.doe@email.com"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Mobile Phone</label>
            <input
              type="tel"
              value={candidate.phone}
              onChange={(e) => onCandidateChange({...candidate, phone: e.target.value})}
              className="apple-input"
              placeholder="e.g. +1 (555) 123-4567"
            />
          </div>
        </div>
      </div>
      
      <div className="p-6 border-t border-gray-100 flex justify-end space-x-3">
        <button 
          onClick={onClose}
          className="apple-button-secondary"
          disabled={isAdding}
        >
          Cancel
        </button>
        <button 
          onClick={onAdd}
          className="apple-button flex items-center space-x-2"
          disabled={isAdding || !candidate.name || !candidate.email}
        >
          {isAdding && <SpinnerIcon />}
          <span>{isAdding ? "Adding..." : "Add Candidate"}</span>
        </button>
      </div>
    </div>
  </div>
);