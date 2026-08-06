import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectStatus } from './project.model';
import { Task } from '../tasks/task.entity';
import { Expose } from 'class-transformer';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 50,
  })
  @Expose()
  name: string;

  @Column({ nullable: true })
  @Expose()
  projectKay: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  @Expose()
  description: string;

  @Column({
    nullable: true,
  })
  @Expose()
  color: string;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.ACTIVE,
  })
  @Expose()
  status?: ProjectStatus;

  @Column({
    type: 'date',
    nullable: false,
  })
  @Expose()
  createdAt: Date;

  @OneToMany(() => Task, (task) => task.project)
  @Expose()
  tasks: Task[];

  @Expose()
  taskCount?: number;
}
