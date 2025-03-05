// components/ComponentsSidebar.tsx
import React, { useState } from 'react';
import { ComponentsSidebarProps, CICDProvider } from '../types';
import ComponentDropdown from './ComponentDropdown';
import ActionButton from './ActionButton';

const ComponentsSidebar: React.FC<ComponentsSidebarProps> = ({
  addNode,
  deleteSelection,
  clearDiagram,
  generateWorkflow,
  showRepoPanel,
  setShowRepoPanel,
  canGenerateConfig,
  generateCICDConfig,
  selectedProvider,
  setSelectedProvider
}) => {
  // Define the options for build, test and deploy
  const buildOptions = [
    'Docker Build',
    'NPM Build',
    'Maven Build',
    'Gradle Build',
    'Make Build'
  ];

  const testOptions = [
    'Unit Tests',
    'Integration Tests',
    'E2E Tests',
    'Performance Tests',
    'Security Tests'
  ];

  const deployOptions = [
    'Docker Deploy',
    'Kubernetes Deploy',
    'AWS Deploy',
    'Azure Deploy',
    'GCP Deploy'
  ];

  // Icon components
  const buildIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clipRule="evenodd" />
    </svg>
  );

  const testIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );

  const deployIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  );

  const deleteIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  );

  const clearIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
    </svg>
  );

  const generateIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
  );

  const analyzeIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
    </svg>
  );

  // For CI/CD provider selection
  const cicdProviders = [
    { id: 'github-actions', name: 'GitHub Actions' },
    { id: 'gitlab-ci', name: 'GitLab CI' },
    { id: 'jenkins', name: 'Jenkins' }
  ];

  // Generate Config Icon
  const generateConfigIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
  );

  return (
    <div className="p-4 bg-gray-50 border-r border-gray-200">
      <h3 className="text-lg font-bold mb-4 text-gray-700">CI/CD Components</h3>
      
      {/* Build Dropdown */}
      <ComponentDropdown 
        title="Build" 
        icon={buildIcon}
        options={buildOptions} 
        onSelect={(option) => addNode(option)}
      />
      
      {/* Test Dropdown */}
      <ComponentDropdown 
        title="Test" 
        icon={testIcon}
        options={testOptions} 
        onSelect={(option) => addNode(option)}
      />
      
      {/* Deploy Dropdown */}
      <ComponentDropdown 
        title="Deploy" 
        icon={deployIcon}
        options={deployOptions} 
        onSelect={(option) => addNode(option)}
      />
      
      <div className="mt-6">
        <h3 className="text-lg font-bold mb-3 text-gray-700">Actions</h3>
        
        <ActionButton 
          label="Delete Selected"
          icon={deleteIcon}
          onClick={deleteSelection}
          color="bg-white"
          textColor="text-red-600"
          borderColor="border-red-300"
          hoverColor="hover:bg-red-50"
        />
        
        <ActionButton 
          label="Clear All"
          icon={clearIcon}
          onClick={clearDiagram}
          color="bg-white"
          textColor="text-gray-600"
          borderColor="border-gray-300"
          hoverColor="hover:bg-gray-50"
        />
        
        <ActionButton 
          label="Generate Workflow"
          icon={generateIcon}
          onClick={generateWorkflow}
          color="bg-green-600"
          textColor="text-white"
          borderColor="border-green-700"
          hoverColor="hover:bg-green-700"
        />
        
        <ActionButton 
          label={showRepoPanel ? 'Hide Repository Panel' : 'Analyze Repository'}
          icon={analyzeIcon}
          onClick={() => setShowRepoPanel(!showRepoPanel)}
          color="bg-purple-600"
          textColor="text-white"
          borderColor="border-purple-700"
          hoverColor="hover:bg-purple-700"
        />
      </div>

      {/* CI/CD Configuration Section */}
      <div className="mt-6">
        <h3 className="text-lg font-bold mb-3 text-gray-700">CI/CD Configuration</h3>
        
        {/* CI/CD Provider Selection */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">CI/CD Provider</label>
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          >
            {cicdProviders.map(provider => (
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Generate CI/CD Config Button */}
        <ActionButton 
          label="Generate CI/CD Config"
          icon={generateConfigIcon}
          onClick={generateCICDConfig}
          color={canGenerateConfig ? "bg-indigo-600" : "bg-gray-400"}
          textColor="text-white"
          borderColor={canGenerateConfig ? "border-indigo-700" : "border-gray-500"}
          hoverColor={canGenerateConfig ? "hover:bg-indigo-700" : ""}
          disabled={!canGenerateConfig}
        />
        
        {!canGenerateConfig && (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-xs text-yellow-700">
              Please analyze a repository first to generate the CI/CD configuration.
            </p>
          </div>
        )}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
        <h4 className="text-sm font-bold text-blue-800 mb-1">Tips</h4>
        <p className="text-xs text-blue-700">
          • Drag nodes by clicking and holding the main area.<br/>
          • Create connections by dragging from the blue output port to the green input port of another node.<br/>
          • Select elements by clicking on them before deleting.<br/>
          • Analyze repository before generating CI/CD configuration.
        </p>
      </div>
    </div>
  );
};

export default ComponentsSidebar;