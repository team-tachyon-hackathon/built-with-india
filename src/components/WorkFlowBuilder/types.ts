// types.ts
import * as go from 'gojs';

// Diagram reference type
export type DiagramRef = React.MutableRefObject<go.Diagram | null>;

// Interface for workflow node data
export interface WorkflowNode {
  key: string;
  loc?: string;
}

// Interface for workflow link data
export interface WorkflowLink {
  from: string;
  to: string;
  fromPort?: string;
  toPort?: string;
}

// Interface for repository analysis data
export interface AnalysisData {
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

// Interface for workflow JSON output
export interface WorkflowNodeData {
  name: string;
  config: Record<string, any>;
}

export interface WorkflowJsonNode {
  id: string;
  type: string;
  data: WorkflowNodeData;
  position: { x: number; y: number };
}

export interface WorkflowJsonEdge {
  id: string;
  source: string;
  target: string;
}

export interface WorkflowJson {
  repoInfo: string;
  nodes: WorkflowJsonNode[];
  edges: WorkflowJsonEdge[];
  ciProvider: string;
}

// CI/CD Provider type
export type CICDProvider = 'github-actions' | 'gitlab-ci' | 'jenkins';

// Component prop types
export interface ComponentsSidebarProps {
  addNode: (key: string) => void;
  deleteSelection: () => void;
  clearDiagram: () => void;
  generateWorkflow: () => WorkflowJson | undefined;
  showRepoPanel: boolean;
  setShowRepoPanel: (show: boolean) => void;
  canGenerateConfig: boolean;
  generateCICDConfig: () => Promise<void>;
  selectedProvider: CICDProvider;
  setSelectedProvider: (provider: CICDProvider) => void;
}

export interface DiagramCanvasProps {
  diagramRef: DiagramRef;
}

export interface RepositoryAnalyzerProps {
  analyzeRepository: (repoOwner: string, repoName: string, repoType: 'github' | 'gitlab') => Promise<void>;
  isLoading: boolean;
  error: string | null;
  repoData: AnalysisData | null;
}

export interface ComponentDropdownProps {
  title: string;
  icon: React.ReactNode;
  options: string[];
  onSelect: (option: string) => void;
}

export interface ActionButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  color?: string;
  textColor?: string;
  borderColor?: string;
  hoverColor?: string;
  disabled?: boolean;
}

export interface GenerateConfigModalProps {
  loading: boolean;
  error: string | null;
  yaml: string;
  provider: CICDProvider;
  onClose: () => void;
  projectName: string;
}