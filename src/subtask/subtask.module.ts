import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subtask } from './subtask.entity';
import { SubtaskController } from './subtask.controller';
import { SubtaskService } from './subtask.service';

@Module({
  imports: [TypeOrmModule.forFeature([Subtask])],
  controllers: [SubtaskController],
  providers: [SubtaskService],
})
export class SubtaskModule {}
