// components/JobCard.js
import React from 'react';
import { LocationIcon, DollarIcon, UsersIcon } from './Icons';

const JobCard = ({ job, onClick }) => {
  return (
    <div
      className="apple-card p-6 cursor-pointer"
      onClick={() => onClick(job)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
            {job.title}
          </h3>
          <p className="text-gray-600 font-medium">{job.company}</p>
        </div>
        <span className="status-badge ml-2">{job.status}</span>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-gray-500">
          <LocationIcon />
          <span className="text-sm">{job.location}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-500">
          <DollarIcon />
          <span className="text-sm font-medium">{job.salary}</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills.slice(0, 3).map((skill, idx) => (
          <span key={idx} className="skill-tag">
            {skill}
          </span>
        ))}
        {job.skills.length > 3 && (
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
            +{job.skills.length - 3}
          </span>
        )}
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <UsersIcon className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {job.candidates} candidates
          </span>
        </div>
        <span className="text-sm text-gray-400">{job.posted}</span>
      </div>
    </div>
  );
};

export default JobCard;