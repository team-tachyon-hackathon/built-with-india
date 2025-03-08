"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { SavedConfig } from '@/models/SavedConfig';
import Link from 'next/link';

export default function SavedConfigurationsPage() {
  const [savedConfigs, setSavedConfigs] = useState<SavedConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchSavedConfigs = async () => {
      try {
        const response = await axios.get('/api/save-config');
        setSavedConfigs(response.data.configs);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching saved configurations:', err);
        setError(err.response?.data?.error || 'Failed to fetch saved configurations');
        setLoading(false);
      }
    };
    
    fetchSavedConfigs();
  }, []);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  const getProviderDisplayName = (provider: string) => {
    switch (provider) {
      case 'github-actions':
        return 'GitHub Actions';
      case 'gitlab-ci':
        return 'GitLab CI';
      case 'jenkins':
        return 'Jenkins';
      default:
        return provider;
    }
  };
  
  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'github-actions':
        return (
          <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        );
      case 'gitlab-ci':
        return (
          <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L23 13.45a.84.84 0 0 1-.35.94z"></path>
          </svg>
        );
      case 'jenkins':
        return (
          <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.219 10.027c0-1.678-1.406-2.977-3.094-2.977-.541 0-.907.113-1.125.227v5.617c.271.158.639.225 1.125.225 1.631 0 3.094-1.352 3.094-3.092zm-3.094 3.573c-.574 0-1.125-.113-1.125-.225v4.971c0 .675.541 1.237 1.125 1.237h4.031c.585 0 1.125-.562 1.125-1.237v-3.436c-.607.112-1.125.225-1.688.225-1.574 0-2.869-.788-3.468-1.535zm19.875-6.55h-4.031c-.584 0-1.125.561-1.125 1.236v3.447c.608-.113 1.125-.225 1.688-.225 1.574 0 2.869.787 3.469 1.535v-4.758c0-.674-.541-1.235-1.125-1.235H21zm-3.469 5.009c-1.631 0-3.094 1.349-3.094 3.088 0 1.679 1.406 2.978 3.094 2.978.542 0 .908-.113 1.125-.227V8.822c-.271-.158-.639-.225-1.125-.225v3.462zM21 7.362c.584 0 1.125.112 1.125.223v-2.81c0-.674-.541-1.235-1.125-1.235h-4.031c-.584 0-1.125.561-1.125 1.236v1.011c.607-.113 1.125-.225 1.688-.225 1.574 0 2.869.788 3.469 1.535V7.362H21zm-18 0c-.584 0-1.125-.112-1.125-.223v2.811c0 .674.541 1.235 1.125 1.235h4.031c.584 0 1.125-.561 1.125-1.235V8.938c-.607.113-1.125.225-1.688.225-1.574 0-2.869-.788-3.469-1.535V7.362H3zm4.031-3.589H3c-.584 0-1.125.561-1.125 1.236v1.012c.607-.113 1.125-.225 1.688-.225 1.574 0 2.869.788 3.469 1.535V5.009c0-.675-.541-1.236-1.125-1.236h.125zm9.938 10.253c0 1.678 1.406 2.977 3.094 2.977.541 0 .907-.113 1.125-.227v-5.617c-.271-.158-.639-.225-1.125-.225-1.631 0-3.094 1.353-3.094 3.092zm-1.688-5.009c-1.631 0-3.094 1.349-3.094 3.088 0 1.679 1.406 2.978 3.094 2.978.542 0 .907-.113 1.125-.227V8.822c-.271-.158-.639-.225-1.125-.225v3.42zm-1.406-5.244H9.844c-.584 0-1.125.561-1.125 1.235v3.447c.607-.113 1.125-.225 1.688-.225 1.574 0 2.869.788 3.468 1.535V5.009c0-.674-.54-1.236-1.125-1.236h.125z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
            <path d="M12 7a1 1 0 0 0-1 1v8a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1z"/>
            <path d="M12 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
          </svg>
        );
    }
  };
  
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Saved CI/CD Configurations</h1>
        <Link href="/" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
          Back to Builder
        </Link>
      </div>
      
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}
      
      {error && !loading && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      {!loading && !error && savedConfigs.length === 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <p className="font-bold">No saved configurations</p>
          <p>You haven't saved any CI/CD configurations yet. Create a workflow and save it for later access.</p>
        </div>
      )}
      
      {savedConfigs.length > 0 && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Saved Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {savedConfigs.map((config) => (
                <tr key={config._id?.toString()} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 text-gray-500">
                        {getProviderIcon(config.provider)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {getProviderDisplayName(config.provider)}
                        </div>
                        {config.projectName && (
                          <div className="text-sm text-gray-500">
                            {config.projectName}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(config.savedAt)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link 
                      href={`/dashboard/${config._id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      View
                    </Link>
                    <button 
                      className="text-red-600 hover:text-red-900"
                      onClick={async () => {
                        if (confirm('Are you sure you want to delete this configuration?')) {
                          try {
                            await axios.delete(`/api/save-config/${config._id}`);
                            setSavedConfigs(savedConfigs.filter(c => c._id !== config._id));
                          } catch (err) {
                            console.error('Error deleting config:', err);
                            alert('Failed to delete configuration');
                          }
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}