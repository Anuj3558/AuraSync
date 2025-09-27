// components/Header.js
import React from 'react';
import { BriefcaseIcon, PlusIcon } from './Icons';

const Header = ({ onNewJobClick }) => {
  return (
    <header className="apple-card mx-6 mt-6 p-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <BriefcaseIcon className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Recruitment</h1>
            <p className="text-gray-600 text-sm">AI-powered hiring assistant</p>
          </div>
        </div>
        
        <button
          onClick={onNewJobClick}
          className="apple-button flex items-center space-x-2"
        >
          <PlusIcon />
          <span>New Position</span>
        </button>
      </div>
    </header>
  );
};

export default Header;