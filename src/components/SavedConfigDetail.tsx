"use client"
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { SavedConfig } from '@/models/SavedConfig';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function SavedConfigDetailPage() {
  const params = useParams();
  const configId = params.id as string;
  
  const [config, setConfig] = useState<SavedConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const codeRef = useRef<HTMLPreElement>(null);
  
  useEffect(() => {
    const fetchSavedConfig = async () => {
      try {
        const response = await axios.get(`/api/save-config/${configId}`);
        setConfig(response.data.config);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching saved configuration:', err);
        setError(err.response?.data?.error || 'Failed to fetch configuration');
        setLoading(false);
      }
    };
    
    if (configId) {
      fetchSavedConfig();
    }
  }, [configId]);
  
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
  
  const getFileName = (provider: string) => {
    switch (provider) {
      case 'github-actions':
        return '.github/workflows/main.yml';
      case 'gitlab-ci':
        return '.gitlab-ci.yml';
      case 'jenkins':
        return 'Jenkinsfile';
      default:
        return 'config.yml';
    }
  };
  
  // Copy to clipboard
  const copyToClipboard = () => {
    if (codeRef.current) {
      const text = codeRef.current.innerText;
      navigator.clipboard.writeText(text)
        .then(() => {
          // Show a temporary copy success message
          const button = document.getElementById('copy-button');
          if (button) {
            const originalText = button.innerText;
            button.innerText = 'Copied!';
            button.classList.add('bg-green-600');
            button.classList.remove('bg-blue-600');
            
            setTimeout(() => {
              button.innerText = originalText;
              button.classList.remove('bg-green-600');
              button.classList.add('bg-blue-600');
            }, 2000);
          }
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
          alert('Failed to copy to clipboard');
        });
    }
  };

  // Download as file
  const downloadFile = () => {
    if (!config) return;
    
    const fileName = getFileName(config.provider);
    
    const blob = new Blob([config.yaml], { type: 'text/yaml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = fileName.split('/').pop() || 'config.yml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Saved CI/CD Configuration</h1>
        <Link href="/dashboard" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
          Back to List
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
      
      {config && !loading && (
        <div>
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h2 className="text-sm font-medium text-gray-500">Provider</h2>
                <p className="mt-1 text-lg text-gray-900">{getProviderDisplayName(config.provider)}</p>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-500">Project Name</h2>
                <p className="mt-1 text-lg text-gray-900">{config.projectName || 'Unknown Project'}</p>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-500">Saved Date</h2>
                <p className="mt-1 text-lg text-gray-900">{formatDate(config.savedAt)}</p>
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-500">File Name</h2>
                <p className="mt-1 text-lg text-gray-900">{getFileName(config.provider)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="flex justify-between items-center px-4 py-2 bg-gray-700 text-white">
              <span className="text-sm font-medium">
                {getFileName(config.provider)}
              </span>
              <div className="space-x-2">
                <button 
                  id="copy-button"
                  onClick={copyToClipboard}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 focus:outline-none"
                >
                  Copy
                </button>
                <button 
                  onClick={downloadFile}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 focus:outline-none"
                >
                  Download
                </button>
              </div>
            </div>
            <pre 
              ref={codeRef}
              className="p-4 text-gray-900 overflow-auto max-h-[60vh] text-sm font-mono whitespace-pre bg-gray-100"
            >{config.yaml}</pre>
          </div>
        </div>
      )}
    </div>
  );
}