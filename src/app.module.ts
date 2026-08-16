import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig } from './config/app.config';
import { appConfigSchema } from './config/config.types';
import { typeOrmConfig } from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectModule } from './project/project.module';
import { CommentModule } from './comment/comment.module';
import { TypedConfigService } from './config/typed-config.service';
import { Task } from './tasks/task.entity';
import { Comment } from './comment/comment.entity';
import { Project } from './project/project.entity';
import { User } from './users/user.entity';
import { TaskLabel } from './tasks/task-label.entity';
import { authConfig } from './config/auth.config';
import { UsersModule } from './users/users.module';
import { ProjectMember } from './projectMember/project-member.entity';
import { ProfileModule } from './profile/profile.module';
import { SubtaskModule } from './subtask/subtask.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: TypedConfigService) => ({
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        ...configService.get('database'),
        entities: [Task, Comment, Project, User, TaskLabel, ProjectMember],
        // dropSchema: true,
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, typeOrmConfig, authConfig],
      validationSchema: appConfigSchema,
      validationOptions: {
        // allowUnknow: false,
        abortEarly: false,
      },
    }),
    TasksModule,
    ProjectModule,
    CommentModule,
    UsersModule,
    ProfileModule,
    SubtaskModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: TypedConfigService,
      useExisting: ConfigService,
    },
  ],
})
export class AppModule {}
