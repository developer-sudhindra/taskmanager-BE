import { ITask } from '../tasks/tasks.model';
export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  status: ProjectStatus;
}

export interface ProjectWithTask extends Project {
  tasks: ITask[];
}

export enum ProjectStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  DONE = 'DONE',
}

export enum ProjectPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum ProjectVisibility {
  PRIVATE = 'PRIVATE',
  TEAM = 'TEAM',
  PUBLIC = 'PUBLIC',
}
