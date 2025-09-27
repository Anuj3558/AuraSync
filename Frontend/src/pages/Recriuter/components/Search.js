// components/Search.js
import React from 'react';
import { SearchIcon } from './Icons';

const Search = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="apple-card p-6 mb-8">
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
          <SearchIcon />
        </div>
        <input
          type="text"
          placeholder="Search positions, companies, or locations..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="apple-input pl-12 text-lg"
        />
      </div>
    </div>
  );
};

export default Search;