// components/GenerateConfigModal.tsx
import React, { useRef, useEffect, useState } from 'react';
import { GenerateConfigModalProps } from '../types';
import axios from 'axios';
import Link from 'next/link';

const GenerateConfigModal: React.FC<GenerateConfigModalProps> = ({
  loading,
  error,
  yaml,
  provider,
  onClose,
  projectName
}) => {
  const codeRef = useRef<HTMLPreElement>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [customProjectName, setCustomProjectName] = useState(projectName || '');

  // Store YAML in localStorage when it's received
  useEffect(() => {
    if (yaml && !loading) {
      localStorage.setItem('generatedCicdYaml', yaml);
      localStorage.setItem('cicdProvider', provider);
      localStorage.setItem('cicdProjectName', projectName || '');
      localStorage.setItem('savedAt', new Date().toISOString());
    }
  }, [yaml, loading, provider, projectName]);

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
    if (!yaml) return;
    
    const fileName = provider === 'github-actions' ? 'github-workflow.yml' : 
                     provider === 'gitlab-ci' ? '.gitlab-ci.yml' : 
                     'Jenkinsfile';
    
    const blob = new Blob([yaml], { type: 'text/yaml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Show project name prompt
  const handleSaveClick = () => {
    // Check if there's a saved project name in localStorage
    const savedProjectName = localStorage.getItem('cicdProjectName') || projectName || '';
    setCustomProjectName(savedProjectName);
    setShowNamePrompt(true);
  };

  // Cancel name prompt
  const handleCancelPrompt = () => {
    setShowNamePrompt(false);
  };

  // Save for later to MongoDB
  const saveForLater = async () => {
    if (!yaml) return;
    
    // Close the name prompt
    setShowNamePrompt(false);
    
    // Update the project name in localStorage
    localStorage.setItem('cicdProjectName', customProjectName);
    
    setSaveStatus('saving');
    setSaveError(null);
    
    try {
      // Get all data from localStorage
      const storedYaml = localStorage.getItem('generatedCicdYaml') || yaml;
      const storedProvider = localStorage.getItem('cicdProvider') || provider;
      const storedSavedAt = localStorage.getItem('savedAt') || new Date().toISOString();
      
      const response = await axios.post('/api/save-config', {
        yaml: storedYaml,
        provider: storedProvider,
        projectName: customProjectName || 'Unnamed Project',
        savedAt: storedSavedAt
      });
      
      // Clear from localStorage after saving to MongoDB
      localStorage.removeItem('generatedCicdYaml');
      localStorage.removeItem('cicdProvider');
      localStorage.removeItem('cicdProjectName');
      localStorage.removeItem('savedAt');
      
      setSaveStatus('success');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        if (setSaveStatus) {
          setSaveStatus('idle');
        }
      }, 3000);
    } catch (err: any) {
      console.error('Failed to save configuration:', err);
      setSaveStatus('error');
      setSaveError(err.response?.data?.message || 'Failed to save configuration');
    }
  };

  // Get provider display name
  const getProviderDisplayName = () => {
    return provider === 'github-actions' ? 'GitHub Actions' : 
           provider === 'gitlab-ci' ? 'GitLab CI' : 
           'Jenkins';
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            {loading ? 'Generating CI/CD Configuration...' : `${getProviderDisplayName()} Configuration`}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="px-6 py-4 flex-1 overflow-auto">
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          )}
          
          {error && !loading && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}
          
          {yaml && !loading && (
            <div className="relative bg-gray-800 rounded-md overflow-hidden">
              <div className="flex justify-between items-center px-4 py-2 bg-gray-700 text-white">
                <span className="text-sm font-medium">
                  {provider === 'github-actions' ? '.github/workflows/main.yml' : 
                   provider === 'gitlab-ci' ? '.gitlab-ci.yml' : 
                   'Jenkinsfile'}
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
                className="p-4 text-white overflow-auto max-h-[60vh] text-sm font-mono whitespace-pre"
              >{yaml}</pre>
            </div>
          )}
          
          {/* Save Status Messages */}
          {saveStatus === 'success' && (
            <div className="mt-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4">
              <p className="font-bold">Success</p>
              <p>Configuration saved for later access.</p>
              <Link href="/saved-configs" className="text-green-800 hover:text-green-900 underline mt-1 inline-block">
                View Saved Configurations
              </Link>
            </div>
          )}
          
          {saveStatus === 'error' && (
            <div className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
              <p className="font-bold">Save Error</p>
              <p>{saveError || 'Failed to save configuration.'}</p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none mr-2"
          >
            Close
          </button>
          <button 
            onClick={copyToClipboard}
            id="copy-button"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none mr-2"
            disabled={loading || !yaml}
          >
            Copy to Clipboard
          </button>
          <button 
            onClick={downloadFile}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none mr-2"
            disabled={loading || !yaml}
          >
            Download
          </button>
          <button 
            onClick={handleSaveClick}
            className={`px-4 py-2 rounded focus:outline-none ${
              saveStatus === 'saving' ? 'bg-gray-400 text-white' :
              saveStatus === 'success' ? 'bg-green-600 text-white' :
              'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
            disabled={loading || !yaml || saveStatus === 'saving' || saveStatus === 'success'}
          >
            {saveStatus === 'saving' ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </div>
            ) : saveStatus === 'success' ? 'Saved!' : 'Save for Later'}
          </button>
        </div>

        {/* Project Name Prompt Modal */}
        {showNamePrompt && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Name Your Project</h3>
              <p className="text-sm text-gray-500 mb-4">
                Give your configuration a name to help you identify it later.
              </p>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 mb-4"
                placeholder="Enter project name"
                value={customProjectName}
                onChange={(e) => setCustomProjectName(e.target.value)}
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleCancelPrompt}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none"
                >
                  Cancel
                </button>
                <button
                  onClick={saveForLater}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateConfigModal;