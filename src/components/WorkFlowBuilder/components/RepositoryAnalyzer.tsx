// components/RepositoryAnalyzer.tsx
import React, { useState } from 'react';
import { RepositoryAnalyzerProps } from '../types';

const RepositoryAnalyzer: React.FC<RepositoryAnalyzerProps> = ({
  analyzeRepository,
  isLoading,
  error,
  repoData
}) => {
  const [repoOwner, setRepoOwner] = useState('');
  const [repoName, setRepoName] = useState('');
  const [repoType, setRepoType] = useState<'github' | 'gitlab'>('github');

  const handleAnalyze = () => {
    analyzeRepository(repoOwner, repoName, repoType);
  };

  return (
    <div className="p-4 mt-2 bg-gray-50 border-t border-gray-200">
      <h3 className="text-lg font-bold mb-3 text-gray-700">Repository Analysis</h3>
      
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">Repository Type</label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio h-4 w-4 text-purple-600"
              checked={repoType === 'github'}
              onChange={() => setRepoType('github')}
            />
            <span className="ml-2 text-sm text-gray-700">GitHub</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio h-4 w-4 text-purple-600"
              checked={repoType === 'gitlab'}
              onChange={() => setRepoType('gitlab')}
            />
            <span className="ml-2 text-sm text-gray-700">GitLab</span>
          </label>
        </div>
      </div>
      
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">Owner/Username</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          value={repoOwner}
          onChange={(e) => setRepoOwner(e.target.value)}
          placeholder="e.g. facebook"
        />
      </div>
      
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-1">Repository Name</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          value={repoName}
          onChange={(e) => setRepoName(e.target.value)}
          placeholder="e.g. react"
        />
      </div>
      
      <button 
        className={`w-full mt-2 px-4 py-2 rounded-md text-white font-medium ${
          isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
        }`}
        onClick={handleAnalyze}
        disabled={isLoading}
      >
        {isLoading ? 'Analyzing...' : 'Analyze & Build Workflow'}
      </button>
      
      {error && (
        <div className="mt-3 p-2 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {repoData && (
        <div className="mt-3 p-2 bg-green-100 border border-green-300 text-green-700 rounded-md text-sm">
          <p className="font-bold">Repository analysis complete! Workflow has been populated.</p>
        </div>
      )}
    </div>
  );
};

export default RepositoryAnalyzer;