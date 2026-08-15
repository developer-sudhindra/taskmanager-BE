import { User } from '../users/user.entity';
import { Project } from '../project/project.entity';
import {
  Entity,
  Unique,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ProjectRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  VIEWER = 'VIEWER',
}

@Entity('project_members')
@Unique(['userId', 'projectId'])
export class ProjectMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ProjectRole,
    default: ProjectRole.MEMBER,
  })
  role: ProjectRole;

  @Column()
  userId: string;

  @Column()
  projectId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  project: Project;
}
