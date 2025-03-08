// models/SavedConfig.ts
import { ObjectId } from 'mongodb';

export interface SavedConfig {
  _id?: ObjectId;
  yaml: string;
  provider: 'github-actions' | 'gitlab-ci' | 'jenkins';
  projectName?: string;
  savedAt: string;
  createdAt: Date;
}

export interface SavedConfigResponse {
  configs: SavedConfig[];
}

export interface SaveConfigResponse {
  message: string;
  id: string;
}