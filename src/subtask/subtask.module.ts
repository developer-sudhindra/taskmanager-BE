import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subtask } from './subtask.entity';
import { SubtaskController } from './subtask.controller';
import { SubtaskService } from './subtask.service';
import { ProjectMemberModule } from '../projectMember/project-member.module';
@Module({
  imports: [TypeOrmModule.forFeature([Subtask]), ProjectMemberModule],
  controllers: [SubtaskController],
  providers: [SubtaskService],
})
export class SubtaskModule {}
