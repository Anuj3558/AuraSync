// components/StatsCards.js
import React from 'react';
import { BriefcaseIcon, UsersIcon, StarIcon } from './Icons';

const StatsCards = ({ jobs }) => {
  const totalCandidates = jobs.reduce((sum, job) => sum + job.candidates, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Open Positions"
        value={jobs.length}
        icon={<BriefcaseIcon className="text-blue-600" />}
        bgColor="bg-blue-100"
      />
      
      <StatCard
        title="Total Candidates"
        value={totalCandidates}
        icon={<UsersIcon className="text-green-600" />}
        bgColor="bg-green-100"
      />
      
      <StatCard
        title="Success Rate"
        value="92%"
        icon={<StarIcon filled className="text-purple-600" />}
        bgColor="bg-purple-100"
      />
      
      <StatCard
        title="AI Match Score"
        value="96.8"
        icon={<StarIcon filled className="text-orange-600" />}
        bgColor="bg-orange-100"
      />
    </div>
  );
};

const StatCard = ({ title, value, icon, bgColor }) => (
  <div className="apple-card p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`w-12 h-12 ${bgColor} rounded-2xl flex items-center justify-center`}>
        {icon}
      </div>
    </div>
  </div>
);

export default StatsCards;