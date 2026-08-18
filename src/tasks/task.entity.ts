/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskPriority, TaskStatus, TaskType } from './tasks.model';
import { Comment } from '../comment/comment.entity';
import { User } from '../users/user.entity';
import { TaskLabel } from './task-label.entity';
import { Project } from '../project/project.entity';
import { Subtask } from '../subtask/subtask.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  description: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    nullable: false,
    default: TaskStatus.OPEN,
  })
  status: TaskStatus;

  @Column({
    type: 'enum',
    enum: TaskPriority,
    nullable: false,
    default: TaskPriority.MEDIUM,
  })
  priority: TaskPriority;

  @Column({
    type: 'enum',
    enum: TaskType,
    nullable: false,
    default: TaskType.TASK,
  })
  type: TaskType;

  @Column()
  projectId: string;

  @OneToMany(() => Comment, (comment) => comment.task)
  comments: Comment[];

  @ManyToOne(() => User, (user) => user.task, {
    nullable: false,
  })
  user: User;

  @Column({
    type: 'uuid',
    nullable: false,
  })
  userId: string;

  @OneToMany(() => TaskLabel, (label) => label.task, {
    cascade: true,
    orphanedRowAction: 'delete',
  })
  labels: TaskLabel[];

  @ManyToOne(() => Project, (project) => project.tasks)
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Subtask, (subtask) => subtask.parentTask)
  subTasks: Subtask[];
}
