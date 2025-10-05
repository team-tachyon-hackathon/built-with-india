// src/app/api/cicdgen/route.ts
import { NextResponse } from 'next/server';


interface NodeConfig {
  image?: string;
  commands?: string[];
  framework?: string;
  environment?: string;
  method?: string;
}

interface NodeData {
  name: string;
  config?: NodeConfig;
}

interface Node {
  id: string;
  type: string;
  data: NodeData;
  position?: {
    x: number;
    y: number;
  };
}

interface Edge {
  id?: string;
  source: string;
  target: string;
}

type CIProvider = 'github-actions' | 'gitlab-ci' | 'jenkins';

export async function POST(request: Request) {
  try {
    const { repoInfo, nodes, edges, ciProvider } = await request.json();

    // Validation
    if (!repoInfo) {
      return NextResponse.json(
        { error: 'Repository information is required' },
        { status: 400 }
      );
    }

    if (!nodes || nodes.length <= 1) {
      return NextResponse.json(
        { error: 'At least one pipeline stage is required' },
        { status: 400 }
      );
    }

    // Use Gemini API - check for API key
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY environment variable is not set');
      return NextResponse.json(
        { error: 'API key configuration error' },
        { status: 500 }
      );
    }
    
    // Convert pipeline design to structured description
    const pipelineDescription = generatePipelineDescription(nodes, edges, ciProvider);

    // Create the prompt with both repository and pipeline information
    const prompt = `
I need to create a CI/CD pipeline configuration for the following repository:

REPOSITORY INFORMATION:
${repoInfo}

PIPELINE DESIGN:
${pipelineDescription}

Generate a complete ${ciProvider} configuration file based on the repository information and the pipeline design.
Return ONLY valid YAML with NO additional explanation, comments, or markdown formatting.
The YAML should be production-ready and follow best practices for ${ciProvider}.
`;

    // Make API call to Gemini API
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 8192
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${response.status} ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    // Extract the response text from the Gemini API response
    const generatedYaml = data.candidates[0].content.parts[0].text;
    
    return NextResponse.json({ yaml: generatedYaml });
  } catch (error: any) {
    console.error('Error generating pipeline with Gemini API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate pipeline' },
      { status: 500 }
    );
  }
}

/**
 * Generate a structured description of the pipeline design
 * @param nodes Array of pipeline nodes
 * @param edges Array of connections between nodes
 * @param ciProvider The CI/CD provider (github-actions, gitlab-ci, jenkins)
 * @returns A formatted string description of the pipeline
 */
function generatePipelineDescription(nodes: Node[], edges: Edge[], ciProvider: CIProvider): string {
  // Skip the start node
  const pipelineNodes = nodes.filter(node => node.id !== 'start' && node.type !== 'input');
  
  let description = `CI/CD provider: ${ciProvider}\n\n`;
  description += `Pipeline stages (${pipelineNodes.length}):\n`;
  
  // Sort nodes by their position in the pipeline
  const sortedNodes = sortNodesByDependencies(nodes, edges);
  
  // Add details for each node
  sortedNodes.forEach((node, index) => {
    if (node.id === 'start' || node.type === 'input') return;
    
    description += `\n${index + 1}. ${node.data.name} (${getNodeTypeName(node.type)}):\n`;
    
    // Add configuration details
    if (node.data.config) {
      if (node.type === 'buildNode') {
        description += `   - Docker image: ${node.data.config.image || 'default'}\n`;
        description += `   - Build commands:\n`;
        (node.data.config.commands || []).forEach(cmd => {
          description += `     * ${cmd}\n`;
        });
      }
      else if (node.type === 'testNode') {
        description += `   - Test framework: ${node.data.config.framework || 'default'}\n`;
        description += `   - Test commands:\n`;
        (node.data.config.commands || []).forEach(cmd => {
          description += `     * ${cmd}\n`;
        });
      }
      else if (node.type === 'deployNode') {
        description += `   - Deployment environment: ${node.data.config.environment || 'production'}\n`;
        description += `   - Deployment method: ${node.data.config.method || 'default'}\n`;
      }
    }
    
    // Add dependencies
    const dependencies = getNodeDependencies(node.id, nodes, edges, false);
    if (dependencies && dependencies.length > 0) {
      description += `   - Depends on: ${dependencies.map(dep => {
        const depNode = nodes.find(n => n.id === dep);
        return depNode ? depNode.data.name : dep;
      }).join(', ')}\n`;
    }
  });
  
  return description;
}

/**
 * Get a human-readable name for a node type
 * @param type The node type identifier
 * @returns A readable name for the node type
 */
function getNodeTypeName(type: string): string {
  switch(type) {
    case 'buildNode': return 'Build Stage';
    case 'testNode': return 'Test Stage';
    case 'deployNode': return 'Deploy Stage';
    default: return 'Unknown Stage';
  }
}

/**
 * Get dependencies for a node based on incoming edges
 * @param nodeId The ID of the node to find dependencies for
 * @param nodes Array of all pipeline nodes
 * @param edges Array of all connections between nodes
 * @param asIds Whether to return node IDs (true) or node objects (false)
 * @returns Array of node IDs or objects that the node depends on
 */
function getNodeDependencies(nodeId: string, nodes: Node[], edges: Edge[], asIds = true): string[] {
  const incomingEdges = edges.filter(edge => edge.target === nodeId);
  const dependencies = incomingEdges.map(edge => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    if (!sourceNode || sourceNode.id === 'start' || sourceNode.type === 'input') return null;
    
    return asIds ? sourceNode.id : sourceNode.id;
  }).filter((dep): dep is string => Boolean(dep));
  
  return dependencies;
}

/**
 * Sort nodes based on their dependencies using topological sorting
 * @param nodes Array of pipeline nodes
 * @param edges Array of connections between nodes
 * @returns Sorted array of nodes in execution order
 */
function sortNodesByDependencies(nodes: Node[], edges: Edge[]): Node[] {
  // Create a dependency graph
  const graph: Record<string, string[]> = {};
  const nonStartNodes = nodes.filter(node => node.id !== 'start' && node.type !== 'input');
  
  // Initialize graph
  nonStartNodes.forEach(node => {
    graph[node.id] = [];
  });
  
  // Add edges to graph
  edges.forEach(edge => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    if (edge.source !== 'start' && sourceNode?.type !== 'input') {
      if (graph[edge.target]) {
        graph[edge.target].push(edge.source);
      }
    }
  });
  
  // Topological sort
  const visited: Record<string, boolean> = {};
  const temp: Record<string, boolean> = {};
  const order: string[] = [];
  
  function visit(nodeId: string): void {
    if (temp[nodeId]) return; // Cycle detected
    if (visited[nodeId]) return;
    
    temp[nodeId] = true;
    
    (graph[nodeId] || []).forEach(dep => {
      visit(dep);
    });
    
    temp[nodeId] = false;
    visited[nodeId] = true;
    order.push(nodeId);
  }
  
  nonStartNodes.forEach(node => {
    if (!visited[node.id]) {
      visit(node.id);
    }
  });
  
  // Map back to node objects and reverse for correct order
  return order
    .reverse()
    .map(id => nodes.find(node => node.id === id))
    .filter((node): node is Node => Boolean(node));
}