export interface Score {
  clarity: number;
  constraints: number;
  continuity: number;
  risk: number;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  stats?: any;
}

export interface Prompt {
  id: string;
  projectId: string;
  type: 'veo3' | 'image' | 'story' | 'workflow';
  title: string;
  content: string;
  params: any;
  caps: string[];
  score?: Score;
  version: number;
  tags: string[];
  updatedAt: string;
}

export interface CAP {
  id: string;
  scope: 'character' | 'env' | 'style';
  signature: string[];
  forbid: string[];
  palette?: string[];
  camera?: string[];
  usageHint?: string;
}

export interface Template {
  id: string;
  type: 'veo3' | 'image' | 'story' | 'workflow';
  title: string;
  inputs: string[];
  content: string;
  bestPractices?: string;
  tags: string[];
}
