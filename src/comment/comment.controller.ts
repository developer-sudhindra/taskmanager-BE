import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentParams } from './create-comment.params';
import { CreateCommentDto } from './create-comment.dto';
import { GetCommentsByTaskParam } from './getCommentsByTask.params';

@Controller('tasks')
export class CommentController {
  constructor(public readonly commentService: CommentService) {}

  @Post(':taskId/comments')
  public createComment(
    @Param() params: CreateCommentParams,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentService.create(params.taskId, dto);
  }

  @Get(':taskId')
  public getAllCommentByTask(@Param() params: GetCommentsByTaskParam) {
    return this.commentService.getAllCommentsByTask(params.taskId);
  }
}
