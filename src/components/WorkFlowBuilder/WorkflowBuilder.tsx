"use client"
import * as go from 'gojs';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import DiagramCanvas from './components/DiagramCanvas';
import ComponentsSidebar from './components/ComponentsSidebar';
import RepositoryAnalyzer from './components/RepositoryAnalyzer';
import GenerateConfigModal from './components/GenerateConfigModal';
import { WorkflowNode, WorkflowLink, AnalysisData, DiagramRef, WorkflowJson } from './types';
import { useDiagram } from './hooks/useDiagram';
import { useWorkflowGenerator } from './hooks/useWorkflowGenerator';

export function WorkflowBuilder() {
  // UI state
  const [showRepoPanel, setShowRepoPanel] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [generatedConfig, setGeneratedConfig] = useState<{yaml: string; loading: boolean; error: string | null}>({
    yaml: '',
    loading: false,
    error: null
  });
  const [selectedProvider, setSelectedProvider] = useState<'github-actions' | 'gitlab-ci' | 'jenkins'>('github-actions');
  
  // Use the custom diagram hook
  const {
    diagramRef,
    addNode,
    deleteSelection,
    clearDiagram,
    populateWorkflowFromAnalysis
  } = useDiagram();
  
  // Use the workflow generator hook
  const { generateWorkflow } = useWorkflowGenerator(diagramRef);
  
  // Repository analysis state
  const [repoData, setRepoData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to analyze repository
  const analyzeRepository = async (repoOwner: string, repoName: string, repoType: 'github' | 'gitlab') => {
    if (!repoOwner || !repoName) {
      setError('Please provide both owner and repository name');
      return;
    }

    setIsLoading(true);
    setError(null);
    setRepoData(null);

    try {
      // Use axios for API calls based on repository type
      let response;
      if (repoType === 'github') {
        response = await axios.get('/api/github/analyze', {
          params: { owner: repoOwner, repo: repoName }
        });
      } else {
        response = await axios.get('/api/gitlab/analyze', {
          params: { owner: repoOwner, repo: repoName }
        });
      }
      
      const analysisData = response.data;
      setRepoData(analysisData);
      console.log('Repository Analysis:', analysisData);
      
      // Auto-populate workflow based on repo analysis
      populateWorkflowFromAnalysis(analysisData);
    } catch (err: any) {
      console.error('Repository analysis error:', err);
      setError(err.response?.data?.error || 'Failed to analyze repository. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function removed as per requirement to remove auto download
  // This comment is kept to maintain code structure

  // Generate CI/CD configuration using the API
  const generateCICDConfig = async () => {
    if (!repoData) {
      setError('Please analyze a repository first');
      return;
    }

    const workflowJson = generateWorkflow();
    if (!workflowJson) {
      setError('Failed to generate workflow JSON');
      return;
    }

    // Add repo info to the workflow JSON
    const enhancedWorkflowJson = {
      ...workflowJson,
      repoInfo: `Repository: ${repoData.repo}\nLanguage: ${repoData.packageManager}\nFramework: ${repoData.packageManager.includes('Node.js') ? 'Node.js' : repoData.packageManager}\nHas Dockerfile: ${repoData.hasDockerfile ? 'Yes' : 'No'}\nHas CI/CD Config: ${repoData.hasCiCdConfig ? 'Yes' : 'No'}`
    };

    // Set loading state
    setGeneratedConfig({
      yaml: '',
      loading: true,
      error: null
    });
    
    // Open the modal
    setShowConfigModal(true);

    try {
      // Call the API to generate CI/CD configuration
      const response = await axios.post('/api/cicdgen', {
        ...enhancedWorkflowJson,
        ciProvider: selectedProvider
      });

      // Update with the generated YAML
      setGeneratedConfig({
        yaml: response.data.yaml,
        loading: false,
        error: null
      });
    } catch (err: any) {
      console.error('CI/CD configuration generation error:', err);
      setGeneratedConfig({
        yaml: '',
        loading: false,
        error: err.response?.data?.error || 'Failed to generate CI/CD configuration'
      });
    }
  };

  // Close the config modal
  const closeConfigModal = () => {
    setShowConfigModal(false);
  };

  return (
    <div className="flex flex-col">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-1/4 flex flex-col">
          <ComponentsSidebar 
            addNode={addNode}
            deleteSelection={deleteSelection}
            clearDiagram={clearDiagram}
            generateWorkflow={generateWorkflow}
            showRepoPanel={showRepoPanel}
            setShowRepoPanel={setShowRepoPanel}
            canGenerateConfig={!!repoData}
            generateCICDConfig={generateCICDConfig}
            selectedProvider={selectedProvider}
            setSelectedProvider={setSelectedProvider}
          />
          
          {/* Repository Analysis Panel - conditionally rendered based on state */}
          {showRepoPanel && (
            <RepositoryAnalyzer 
              analyzeRepository={analyzeRepository}
              isLoading={isLoading}
              error={error}
              repoData={repoData}
            />
          )}
        </div>
        
        {/* Main Diagram Canvas */}
        <div className="w-3/4">
          <DiagramCanvas diagramRef={diagramRef} />
        </div>
      </div>

      {/* Generate Config Modal */}
      {showConfigModal && (
        <GenerateConfigModal 
          loading={generatedConfig.loading}
          error={generatedConfig.error}
          yaml={generatedConfig.yaml}
          provider={selectedProvider}
          onClose={closeConfigModal}
        />
      )}
    </div>
  );
}