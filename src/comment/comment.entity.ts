import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Task } from '../tasks/task.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  message: string;

  @Column({ type: 'uuid' })
  taskId: string;

  @ManyToOne(() => Task, (task: Task) => task.comments, { nullable: false })
  @JoinColumn({ name: 'taskId' })
  task: Task;

  @Column({
    type: 'date',
    nullable: false,
  })
  createdAt: Date;
}
