// components/JobsGrid.js
import React from 'react';
import { BriefcaseIcon } from './Icons';
import JobCard from './JobCard';

const JobsGrid = ({ jobs, searchTerm, onJobClick, onCreateJob }) => {
  if (jobs.length === 0) {
    return (
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
            onClick={onCreateJob}
            className="apple-button"
          >
            Create First Position
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} onClick={onJobClick} />
      ))}
    </div>
  );
};

export default JobsGrid;