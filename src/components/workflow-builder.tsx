"use client"
import * as go from 'gojs';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

export function WorkflowBuilder() {
  // Diagram reference
  const diagramRef = useRef<go.Diagram | null>(null);
  
  // UI state
  const [showBuildOptions, setShowBuildOptions] = useState(false);
  const [showTestOptions, setShowTestOptions] = useState(false);
  const [showDeployOptions, setShowDeployOptions] = useState(false);
  
  // Repository analysis state
  interface AnalysisData {
    repo: string;
    filesCount: number;
    dockerFiles: string[];
    ciCdFiles: string[];
    packageManager: string;
    hasDockerfile: boolean;
    hasCiCdConfig: boolean;
    message?: string;
    deepSeekAnalysis?: string;
  }
  
  const [repoOwner, setRepoOwner] = useState('');
  const [repoName, setRepoName] = useState('');
  const [repoType, setRepoType] = useState<'github' | 'gitlab'>('github');
  const [repoData, setRepoData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRepoPanel, setShowRepoPanel] = useState(false);

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

  useEffect(() => {
    // Clean up any existing diagram to prevent duplicates
    if (diagramRef.current) {
      diagramRef.current.div = null;
    }

    // Wait for the DOM to be ready
    if (!document.getElementById('myDiagramDiv')) return;

    const $ = go.GraphObject.make;

    // Create a new diagram
    const diagram = $(go.Diagram, 'myDiagramDiv', {
      // Basic configuration
      'undoManager.isEnabled': true,
      
      // Enable tools explicitly
      'linkingTool.isEnabled': true,
      'linkingTool.direction': go.LinkingTool.ForwardsOnly,
      'draggingTool.isEnabled': true, // Explicitly enable dragging
      
      // Allow operations
      allowMove: true, // Essential for dragging
      allowDelete: true,
      allowDrop: true,
      
      // Appearance
      initialContentAlignment: go.Spot.Center,
      padding: 10,
      
      // Layout
      layout: $(go.ForceDirectedLayout, {
        defaultSpringLength: 50,
        defaultElectricalCharge: 100
      })
    });

    // Create node template with explicit dragging support
    diagram.nodeTemplate = $(
      go.Node, 
      'Auto',
      { 
        // Enable dragging for this node explicitly
        movable: true,
        selectable: true,
        resizable: false,
        
        // Cursor and position
        cursor: 'move',
        locationSpot: go.Spot.Center,
        
        // Add some shadow for better visual feedback
        shadowVisible: true,
      },
      // Node appearance - customize based on node type
      $(go.Shape, 'RoundedRectangle', 
        {
          strokeWidth: 2,
          stroke: 'gray',
          fill: "white",
          portId: "",
        },
        new go.Binding("fill", "key", (k) => {
          if (k.includes('Build')) return "#E1F5FE";  // Light blue
          if (k.includes('Test')) return "#E8F5E9";   // Light green
          if (k.includes('Deploy')) return "#FFF3E0"; // Light orange
          return "white";
        }),
        new go.Binding("stroke", "key", (k) => {
          if (k.includes('Build')) return "#039BE5";  // Blue
          if (k.includes('Test')) return "#43A047";   // Green
          if (k.includes('Deploy')) return "#FB8C00"; // Orange
          return "gray";
        })
      ),
      $(go.TextBlock, 
        { 
          margin: 10,
          font: '14px Inter, system-ui, sans-serif',
          editable: false
        }, 
        new go.Binding('text', 'key')
      ),
      
      // Input port - on the left
      $(go.Panel, "Auto",
        { 
          alignment: new go.Spot(0, 0.5, -8, 0),
          portId: "input",
          fromLinkable: false,
          toLinkable: true,
          toSpot: go.Spot.Left,
          cursor: "pointer"
        },
        $(go.Shape, "Circle", {
          width: 14,
          height: 14,
          fill: "#6FCF97",  // Green for input
          stroke: "#27AE60",
          strokeWidth: 1,
          toolTip: $(go.Adornment, "Auto",
            $(go.Shape, { fill: "#FFFFCC" }),
            $(go.TextBlock, { margin: 4, text: "Input connection" })
          )
        })
      ),
      
      // Output port - on the right
      $(go.Panel, "Auto",
        {
          alignment: new go.Spot(1, 0.5, 8, 0),
          portId: "output",
          fromLinkable: true,
          toLinkable: false,
          fromSpot: go.Spot.Right,
          cursor: "pointer"
        },
        $(go.Shape, "Circle", {
          width: 14,
          height: 14,
          fill: "#41adff",  // Blue for output
          stroke: "#1E75BB",
          strokeWidth: 1,
          toolTip: $(go.Adornment, "Auto",
            $(go.Shape, { fill: "#FFFFCC" }),
            $(go.TextBlock, { margin: 4, text: "Output connection" })
          )
        })
      )
    );

    // Link template
    diagram.linkTemplate = $(
      go.Link,
      { 
        routing: go.Link.AvoidsNodes,
        curve: go.Link.JumpOver,
        corner: 5,
        relinkableFrom: true, 
        relinkableTo: true,
        reshapable: true,
        resegmentable: true
      },
      $(go.Shape, { 
        strokeWidth: 2,
        stroke: '#2E86C1'
      }),
      $(go.Shape, { 
        toArrow: 'Standard',
        stroke: '#2E86C1',
        fill: '#2E86C1'
      })
    );

    // Initialize a GraphLinksModel
    const model = new go.GraphLinksModel([], []);
    model.linkKeyProperty = 'id'; // important for clear operations
    diagram.model = model;

    // Setup keyboard commands
    diagram.commandHandler.archetypeGroupData = { key: "Group", isGroup: true };
    
    // Enable delete key to remove selected elements
    diagram.commandHandler.doKeyDown = function() {
      const e = diagram.lastInput;
      if (e.key === "Delete" || e.key === "Backspace") {
        this.deleteSelection();
        return true;
      }
      return go.CommandHandler.prototype.doKeyDown.call(this);
    };

    // Save the reference
    diagramRef.current = diagram;

    // Clean up function
    return () => {
      if (diagramRef.current) {
        diagramRef.current.div = null;
      }
    };
  }, []);

  const addNode = (key: string) => {
    if (!diagramRef.current) return;

    const diagram = diagramRef.current;
    
    // Start transaction
    diagram.startTransaction('add node');
    
    // Add the node with a unique position
    const model = diagram.model;
    model.addNodeData({ 
      key: key,
      // We add a location property for positioning
      loc: `${100 + Math.random() * 200} ${100 + Math.random() * 100}`
    });
    
    // Commit transaction
    diagram.commitTransaction('add node');
  };

  const deleteSelection = () => {
    if (!diagramRef.current) return;

    const diagram = diagramRef.current;
    diagram.startTransaction('delete selection');
    diagram.commandHandler.deleteSelection();
    diagram.commitTransaction('delete selection');
  };

  const clearDiagram = () => {
    if (!diagramRef.current) return;

    const diagram = diagramRef.current;
    
    // We can't replace the model during a transaction, so we:
    // 1. First end any current transaction
    diagram.commitTransaction("end current transaction");
    
    // 2. Then replace the model without using a transaction
    diagram.model = new go.GraphLinksModel([], []);
  };

  // Function to analyze repository
  const analyzeRepository = async () => {
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
      
      // Also download the analysis as JSON
      downloadRepoAnalysis(analysisData);
    } catch (err: any) {
      console.error('Repository analysis error:', err);
      setError(err.response?.data?.error || 'Failed to analyze repository. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Download repository analysis as JSON
  const downloadRepoAnalysis = (analysisData: any) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(analysisData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${repoOwner}-${repoName}-analysis.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // Auto-populate workflow based on repository analysis
  const populateWorkflowFromAnalysis = (analysisData: any) => {
    if (!diagramRef.current) return;
    
    const diagram = diagramRef.current;
    
    // Start with a clean diagram
    diagram.commitTransaction("end current transaction");
    diagram.model = new go.GraphLinksModel([], []);
    
    // Add nodes based on package manager
    const nodes: any[] = [];
    const links: any[] = [];
    let yPosition = 0;
    
    // Start node
    nodes.push({ key: "Start", loc: `250 ${yPosition}` });
    yPosition += 100;
    
    // Install dependencies node
    nodes.push({ 
      key: analysisData.packageManager.includes("Node.js") ? "NPM Install" : 
           analysisData.packageManager.includes("Python") ? "Pip Install" :
           analysisData.packageManager.includes("Java") ? "Maven Build" : "Install Dependencies",
      loc: `250 ${yPosition}`
    });
    links.push({ from: "Start", to: nodes[nodes.length-1].key, fromPort: "output", toPort: "input" });
    yPosition += 100;
    
    // Add linting if it's a Node.js project
    if (analysisData.packageManager.includes("Node.js")) {
      nodes.push({ key: "ESLint", loc: `250 ${yPosition}` });
      links.push({ from: nodes[nodes.length-2].key, to: "ESLint", fromPort: "output", toPort: "input" });
      yPosition += 100;
    }
    
    // Add unit tests
    nodes.push({ key: "Unit Tests", loc: `250 ${yPosition}` });
    links.push({ from: nodes[nodes.length-2].key, to: "Unit Tests", fromPort: "output", toPort: "input" });
    yPosition += 100;
    
    // Add Docker build if Dockerfile exists
    if (analysisData.hasDockerfile) {
      nodes.push({ key: "Docker Build", loc: `250 ${yPosition}` });
      links.push({ from: "Unit Tests", to: "Docker Build", fromPort: "output", toPort: "input" });
      yPosition += 100;
    }
    
    // Add deployment node
    nodes.push({ key: "Deploy to Staging", loc: `250 ${yPosition}` });
    links.push({ 
      from: analysisData.hasDockerfile ? "Docker Build" : "Unit Tests", 
      to: "Deploy to Staging", 
      fromPort: "output", 
      toPort: "input" 
    });
    
    // Update diagram
    const model = diagram.model as go.GraphLinksModel;
    diagram.startTransaction("add nodes from repo analysis");
    
    // Add all nodes and links
    nodes.forEach(node => model.addNodeData(node));
    links.forEach(link => model.addLinkData(link));
    
    diagram.commitTransaction("add nodes from repo analysis");
  };

  // Generate workflow JSON
  const generateWorkflow = () => {
    if (!diagramRef.current) return;
    
    const diagram = diagramRef.current;
    const model = diagram.model as go.GraphLinksModel;
    
    // Define TypeScript interfaces for our workflow JSON structure
    interface NodeData {
      name: string;
      config: Record<string, any>;
    }
    
    interface WorkflowNode {
      id: string;
      type: string;
      data: NodeData;
      position: { x: number; y: number };
    }
    
    interface WorkflowEdge {
      id: string;
      source: string;
      target: string;
    }
    
    interface WorkflowJson {
      repoInfo: string;
      nodes: WorkflowNode[];
      edges: WorkflowEdge[];
      ciProvider: string;
    }
    
    // Create the workflow JSON structure
    const workflowJson: WorkflowJson = {
      repoInfo: "Repository: my-microservice-app\nLanguage: TypeScript\nFramework: NextJS",
      nodes: [],
      edges: [],
      ciProvider: "github-actions"
    };
    
    // Map GoJS nodes to workflow nodes
    const nodes: WorkflowNode[] = model.nodeDataArray.map((nodeData: any, index: number) => {
      // Determine node type based on the key
      let nodeType = "buildNode"; // default
      if (nodeData.key.includes("Test")) {
        nodeType = "testNode";
      } else if (nodeData.key.includes("Deploy")) {
        nodeType = "deployNode";
      }
      
      // Get node position if available
      const node = diagram.findNodeForData(nodeData);
      const position = node ? { x: node.location.x, y: node.location.y } : { x: 250, y: index * 100 };
      
      // Create node configuration based on type
      let config: Record<string, any> = {};
      
      if (nodeType === "buildNode") {
        config = {
          image: nodeData.key.includes("Docker") ? "docker:20.10.16" : "node:18-alpine",
          commands: [
            "npm ci",
            nodeData.key.includes("Docker") ? "docker build -t app:${GITHUB_SHA} ." : "npm run build"
          ]
        };
      } else if (nodeType === "testNode") {
        config = {
          framework: nodeData.key.includes("Unit") ? "Jest" : 
                    nodeData.key.includes("Integration") ? "Jest" : 
                    nodeData.key.includes("E2E") ? "Cypress" : "Custom",
          commands: [
            nodeData.key.includes("Unit") ? "npm run test:unit" : 
            nodeData.key.includes("Integration") ? "npm run test:integration" :
            nodeData.key.includes("E2E") ? "npm run test:e2e" : "npm run test"
          ]
        };
      } else if (nodeType === "deployNode") {
        config = {
          environment: nodeData.key.includes("Production") ? "production" : "staging",
          method: nodeData.key.includes("AWS") ? "AWS ECS" : 
                 nodeData.key.includes("Azure") ? "Azure Web App" :
                 nodeData.key.includes("GCP") ? "GCP Cloud Run" : "Kubernetes"
        };
      }
      
      return {
        id: `n${index + 1}`,
        type: nodeType,
        data: {
          name: nodeData.key,
          config: config
        },
        position: position
      };
    });
    
    // Add a start node
    nodes.unshift({
      id: "start",
      type: "input",
      data: { 
        name: "Start",
        config: {} // Add empty config to satisfy the type requirement
      },
      position: { x: 250, y: 0 }
    });
    
    // Map GoJS links to workflow edges
    const nodeIdMap = new Map<string, string>();
    nodes.forEach(node => {
      nodeIdMap.set(node.data.name, node.id);
    });
    
    const edges: WorkflowEdge[] = [];
    model.linkDataArray.forEach((linkData: any, index: number) => {
      const fromNode = model.findNodeDataForKey(linkData.from);
      const toNode = model.findNodeDataForKey(linkData.to);
      
      if (fromNode && toNode) {
        // Find the corresponding IDs in our nodes array
        const fromId = fromNode.key === "Start" ? "start" : 
                      nodeIdMap.get(fromNode.key) || `n${nodes.findIndex(n => n.data.name === fromNode.key) + 1}`;
        const toId = toNode.key === "Start" ? "start" : 
                    nodeIdMap.get(toNode.key) || `n${nodes.findIndex(n => n.data.name === toNode.key) + 1}`;
        
        edges.push({
          id: `e${index + 1}`,
          source: fromId,
          target: toId
        });
      }
    });
    
    // If there's no link from start to the first node, add one
    if (edges.length > 0 && !edges.some(e => e.source === "start")) {
      if (nodes.length > 1) {
        edges.unshift({
          id: "e0",
          source: "start",
          target: nodes[1].id // First non-start node
        });
      }
    }
    
    // Update the workflow object
    workflowJson.nodes = nodes;
    workflowJson.edges = edges;
    
    // Log and download the JSON
    console.log("Generated Workflow JSON:", workflowJson);
    
    // Create a download link
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(workflowJson, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "workflow.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    return workflowJson;
  };

  return (
    <div className="flex flex-col">
      <div className="flex">
        <div className="w-1/4 p-4 bg-gray-50 border-r border-gray-200">
          <h3 className="text-lg font-bold mb-4 text-gray-700">CI/CD Components</h3>
          
          {/* Build Dropdown */}
          <div className="relative mb-3">
            <button
              className="flex items-center justify-between w-full px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
              onClick={() => setShowBuildOptions(!showBuildOptions)}
            >
              <div className="flex items-center">
                <span className="mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clipRule="evenodd" />
                  </svg>
                </span>
                Build
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${showBuildOptions ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            {showBuildOptions && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                {buildOptions.map((option) => (
                  <button
                    key={option}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                    onClick={() => {
                      addNode(option);
                      setShowBuildOptions(false);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Test Dropdown */}
          <div className="relative mb-3">
            <button
              className="flex items-center justify-between w-full px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
              onClick={() => setShowTestOptions(!showTestOptions)}
            >
              <div className="flex items-center">
                <span className="mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
                Test
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${showTestOptions ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            {showTestOptions && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                {testOptions.map((option) => (
                  <button
                    key={option}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                    onClick={() => {
                      addNode(option);
                      setShowTestOptions(false);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Deploy Dropdown */}
          <div className="relative mb-3">
            <button
              className="flex items-center justify-between w-full px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
              onClick={() => setShowDeployOptions(!showDeployOptions)}
            >
              <div className="flex items-center">
                <span className="mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
                Deploy
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${showDeployOptions ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            {showDeployOptions && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                {deployOptions.map((option) => (
                  <button
                    key={option}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                    onClick={() => {
                      addNode(option);
                      setShowDeployOptions(false);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-3 text-gray-700">Actions</h3>
            <button
              className="flex items-center w-full px-4 py-2 mb-2 bg-white text-red-600 border border-red-300 rounded-md shadow-sm hover:bg-red-50 focus:outline-none"
              onClick={deleteSelection}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Delete Selected
            </button>
            <button
              className="flex items-center w-full px-4 py-2 mb-2 bg-white text-gray-600 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
              onClick={clearDiagram}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Clear All
            </button>
            <button
              className="flex items-center w-full px-4 py-2 mb-2 bg-green-600 text-white border border-green-700 rounded-md shadow-sm hover:bg-green-700 focus:outline-none"
              onClick={generateWorkflow}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              Generate Workflow
            </button>
            <button
              className="flex items-center w-full px-4 py-2 mb-2 bg-purple-600 text-white border border-purple-700 rounded-md shadow-sm hover:bg-purple-700 focus:outline-none"
              onClick={() => setShowRepoPanel(!showRepoPanel)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              {showRepoPanel ? 'Hide Repository Panel' : 'Analyze Repository'}
            </button>
          </div>
          
          {/* Repository Analysis Panel */}
          {showRepoPanel && (
            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
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
                onClick={analyzeRepository}
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
                  <p className="font-bold">Analysis complete! Workflow has been populated.</p>
                  <div className="mt-1 text-xs">
                    <strong>Repository:</strong> {repoData.repo}<br/>
                    <strong>Package Manager:</strong> {repoData.packageManager}<br/>
                    <strong>Files Count:</strong> {repoData.filesCount}<br/>
                    <strong>Has Dockerfile:</strong> {repoData.hasDockerfile ? 'Yes' : 'No'}<br/>
                    <strong>Has CI/CD Config:</strong> {repoData.hasCiCdConfig ? 'Yes' : 'No'}
                  </div>
                  
                  {repoData.dockerFiles && repoData.dockerFiles.length > 0 && (
                    <div className="mt-1">
                      <strong className="text-xs">Dockerfiles:</strong>
                      <ul className="ml-2 text-xs">
                        {repoData.dockerFiles.map((file, index) => (
                          <li key={index} className="text-blue-700">{file}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {repoData.ciCdFiles && repoData.ciCdFiles.length > 0 && (
                    <div className="mt-1">
                      <strong className="text-xs">CI/CD Files:</strong>
                      <ul className="ml-2 text-xs">
                        {repoData.ciCdFiles.map((file, index) => (
                          <li key={index} className="text-blue-700">{file}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {repoData.deepSeekAnalysis && (
                    <div className="mt-2 text-xs p-1 bg-blue-50 rounded">
                      <strong>AI Analysis:</strong>
                      <p className="italic text-blue-800">{repoData.deepSeekAnalysis}</p>
                    </div>
                  )}
                  
                  {repoData.message && (
                    <p className="mt-1 text-xs font-semibold">{repoData.message}</p>
                  )}
                </div>
              )}
            </div>
          )}
          
          <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
            <h4 className="text-sm font-bold text-blue-800 mb-1">Tips</h4>
            <p className="text-xs text-blue-700">
              • Drag nodes by clicking and holding the main area.<br/>
              • Create connections by dragging from the blue output port to the green input port of another node.<br/>
              • Select elements by clicking on them before deleting.
            </p>
          </div>
        </div>
        <div className="w-3/4">
          <div id="myDiagramDiv" className="w-full h-screen border border-gray-200"></div>
        </div>
      </div>
    </div>
  );
}