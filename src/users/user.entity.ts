import { Expose } from 'class-transformer';
import { Task } from '../tasks/task.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.enum';
import { Theme } from './theme.enum';
import { MenuType } from './menu-type.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @Column()
  @Expose()
  name: string;

  @Column()
  @Expose()
  email: string;

  @Column()
  password: string;

  @Column({
    default: Theme.DARK,
  })
  @Expose()
  theme: string;

  @Column({
    nullable: true,
  })
  @Expose()
  avatarURL: string;

  @Column({
    default: MenuType.standard,
  })
  @Expose()
  menuType: string;

  @CreateDateColumn()
  @Expose()
  createdAt: Date;

  @UpdateDateColumn()
  @Expose()
  updatedAt: Date;

  @OneToMany(() => Task, (task) => task.user)
  @Expose()
  task: Task[];

  @Column('text', {
    array: true,
    default: [Role.USER],
  })
  @Expose()
  roles: Role[];
}
