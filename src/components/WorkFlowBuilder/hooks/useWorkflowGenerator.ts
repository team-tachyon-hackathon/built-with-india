// hooks/useWorkflowGenerator.ts
import * as go from 'gojs';
import { DiagramRef, WorkflowJson } from '../types';

export function useWorkflowGenerator(diagramRef: DiagramRef) {
  // Generate workflow JSON
  const generateWorkflow = (): WorkflowJson | undefined => {
    if (!diagramRef.current) return;
    
    const diagram = diagramRef.current;
    const model = diagram.model as go.GraphLinksModel;
    
    // Create the workflow JSON structure
    const workflowJson: WorkflowJson = {
      repoInfo: "Repository: my-microservice-app\nLanguage: TypeScript\nFramework: NextJS",
      nodes: [],
      edges: [],
      ciProvider: "github-actions" // This will be overridden when generating CI/CD config
    }
    
    // Map GoJS nodes to workflow nodes
    const nodes = model.nodeDataArray.map((nodeData: any, index: number) => {
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
    
    const edges: Array<{id: string, source: string, target: string}> = [];
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
    
    // Log the workflow JSON
    console.log("Generated Workflow JSON:", workflowJson);
    
    return workflowJson;
  };

  return { generateWorkflow };
}