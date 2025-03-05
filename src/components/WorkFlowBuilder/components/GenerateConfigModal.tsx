// components/GenerateConfigModal.tsx
import React, { useRef } from 'react';
import { GenerateConfigModalProps } from '../types';

const GenerateConfigModal: React.FC<GenerateConfigModalProps> = ({
  loading,
  error,
  yaml,
  provider,
  onClose
}) => {
  const codeRef = useRef<HTMLPreElement>(null);

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
          >
            Copy to Clipboard
          </button>
          <button 
            onClick={downloadFile}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateConfigModal;