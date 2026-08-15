import { Controller, Get, Patch, Post } from '@nestjs/common';
import { SubtaskService } from './subtask.service';
import { Param, Body } from '@nestjs/common';
import { FindTaskParams } from './find-task-params';
import { CreateSubtaskDto } from './create-subtask.dto';
import { Subtask } from './subtask.entity';

@Controller('subtask')
export class SubtaskController {
  constructor(private readonly subtaskService: SubtaskService) {}

  @Get('/:taskId')
  public async findAll(@Param() params: FindTaskParams): Promise<Subtask[]> {
    return await this.subtaskService.findAll(params.taskId);
  }

  @Post()
  public async createSubTask(
    @Body() CreateSubtaskDto: CreateSubtaskDto,
  ): Promise<Subtask> {
    return await this.subtaskService.createSubTask(CreateSubtaskDto);
  }

  @Patch('/:subTaskId')
  public async UpdateSubTask(
    @Param('subTaskId') subTaskId: string,
    @Body() updateTaskDto: CreateSubtaskDto,
  ) {
    return await this.subtaskService.updateSubTask(subTaskId, updateTaskDto);
  }
}
