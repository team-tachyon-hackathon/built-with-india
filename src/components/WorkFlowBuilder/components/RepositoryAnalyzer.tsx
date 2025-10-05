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
    <div className="p-4 mt-2 bg-background border-t border-border">
      <h3 className="text-lg font-bold mb-3 text-foreground">Repository Analysis</h3>
      
      <div className="mb-3">
        <label className="block text-sm font-medium text-foreground mb-1">Repository Type</label>
        <div className="flex space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio h-4 w-4 text-purple-600"
              checked={repoType === 'github'}
              onChange={() => setRepoType('github')}
            />
            <span className="ml-2 text-sm text-foreground">GitHub</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio h-4 w-4 text-purple-600"
              checked={repoType === 'gitlab'}
              onChange={() => setRepoType('gitlab')}
            />
            <span className="ml-2 text-sm text-foreground">GitLab</span>
          </label>
        </div>
      </div>
      
      <div className="mb-3">
        <label className="block text-sm font-medium text-foreground mb-1">Owner/Username</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-border rounded-md shadow-sm bg-background text-foreground focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          value={repoOwner}
          onChange={(e) => setRepoOwner(e.target.value)}
          placeholder="e.g. facebook"
        />
      </div>
      
      <div className="mb-3">
        <label className="block text-sm font-medium text-foreground mb-1">Repository Name</label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-border rounded-md shadow-sm bg-background text-foreground focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          value={repoName}
          onChange={(e) => setRepoName(e.target.value)}
          placeholder="e.g. react"
        />
      </div>
      
      <button 
        className={`w-full mt-2 px-4 py-2 rounded-md text-white font-medium ${
          isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800'
        }`}
        onClick={handleAnalyze}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing...
          </div>
        ) : 'Analyze & Build Workflow'}
      </button>
      
      {error && (
        <div className="mt-3 p-2 bg-red-100 dark:bg-red-950 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 rounded-md text-sm">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
          {error.includes('timed out') && (
            <p className="mt-1 text-xs">
              Try using a smaller repository or check if the repository is accessible.
            </p>
          )}
        </div>
      )}
      
      {repoData && (
        <div className="mt-3 p-2 bg-green-100 dark:bg-green-950 border border-green-300 dark:border-green-800 text-green-700 dark:text-green-300 rounded-md text-sm">
          <p className="font-bold">Repository analysis complete! Workflow has been populated.</p>
        </div>
      )}
    </div>
  );
};

export default RepositoryAnalyzer;