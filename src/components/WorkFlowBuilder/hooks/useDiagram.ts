// hooks/useDiagram.ts
import { useRef, useEffect } from 'react';
import * as go from 'gojs';
import { AnalysisData, DiagramRef } from '../types';

export function useDiagram() {
  // Diagram reference
  const diagramRef = useRef<go.Diagram | null>(null);

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

  // Auto-populate workflow based on repository analysis
  const populateWorkflowFromAnalysis = (analysisData: AnalysisData) => {
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
    const hasDependencies = analysisData.packageManager !== "Unknown";
    const dependencyStep = { 
      key: analysisData.packageManager.includes("Node.js") ? "NPM Install" : 
           analysisData.packageManager.includes("Python") ? "Pip Install" :
           analysisData.packageManager.includes("Java") ? "Maven Build" : 
           analysisData.packageManager.includes("Go") ? "Go Get" : "Install Dependencies",
      loc: `250 ${yPosition}`
    };
    
    nodes.push(dependencyStep);
    links.push({ from: "Start", to: dependencyStep.key, fromPort: "output", toPort: "input" });
    yPosition += 100;
    
    // Add linting if it's a Node.js project or if CI config files suggest linting
    const hasLinting = analysisData.packageManager.includes("Node.js") || 
                      (analysisData.ciCdFiles && 
                       analysisData.ciCdFiles.some(file => 
                         file.toLowerCase().includes("lint") || 
                         file.toLowerCase().includes("eslint") || 
                         file.toLowerCase().includes("prettier")
                       ));
    
    if (hasLinting) {
      const lintStep = { key: "ESLint", loc: `250 ${yPosition}` };
      nodes.push(lintStep);
      links.push({ from: dependencyStep.key, to: lintStep.key, fromPort: "output", toPort: "input" });
      yPosition += 100;
      
      // Add unit tests after linting
      const testStep = { key: "Unit Tests", loc: `250 ${yPosition}` };
      nodes.push(testStep);
      links.push({ from: lintStep.key, to: testStep.key, fromPort: "output", toPort: "input" });
      yPosition += 100;
    } else {
      // Add unit tests directly after dependencies
      const testStep = { key: "Unit Tests", loc: `250 ${yPosition}` };
      nodes.push(testStep);
      links.push({ from: dependencyStep.key, to: testStep.key, fromPort: "output", toPort: "input" });
      yPosition += 100;
    }
    
    // Get the last node added (should be the unit tests)
    const lastNodeKey = nodes[nodes.length - 1].key;
    
    // Add integration tests if CI config suggests them
    const hasIntegrationTests = analysisData.ciCdFiles && 
                               analysisData.ciCdFiles.some(file => 
                                 file.toLowerCase().includes("integration") || 
                                 file.toLowerCase().includes("e2e")
                               );
    
    if (hasIntegrationTests) {
      const integrationStep = { key: "Integration Tests", loc: `250 ${yPosition}` };
      nodes.push(integrationStep);
      links.push({ from: lastNodeKey, to: integrationStep.key, fromPort: "output", toPort: "input" });
      yPosition += 100;
    }
    
    // Add Docker build if Dockerfile exists
    if (analysisData.hasDockerfile) {
      const dockerStep = { key: "Docker Build", loc: `250 ${yPosition}` };
      nodes.push(dockerStep);
      links.push({ 
        from: nodes[nodes.length - 1].key, 
        to: dockerStep.key, 
        fromPort: "output", 
        toPort: "input" 
      });
      yPosition += 100;
    }
    
    // Add deployment node
    const deployStage = analysisData.hasDockerfile ? "Docker Deploy" : "Deploy to Staging";
    const deployStep = { key: deployStage, loc: `250 ${yPosition}` };
    nodes.push(deployStep);
    links.push({ 
      from: nodes[nodes.length - 1].key, 
      to: deployStep.key, 
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

  return {
    diagramRef,
    addNode,
    deleteSelection,
    clearDiagram,
    populateWorkflowFromAnalysis
  };
}