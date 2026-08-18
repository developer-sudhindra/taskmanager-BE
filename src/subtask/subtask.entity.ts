import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskStatus } from '../tasks/tasks.model';
import { Task } from '../tasks/task.entity';

@Entity()
export class Subtask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 80,
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

  @Column()
  assigneeId: string;

  @Column()
  parentTaskId: string;

  @ManyToOne(() => Task, (task) => task.subTasks, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parentTaskId' })
  parentTask: Task;
}
