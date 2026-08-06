import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './create-comment.dto';
import { Comment } from './comment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  public async create(taskId: string, dto: CreateCommentDto): Promise<Comment> {
    const comment = {
      taskId: taskId,
      createdAt: new Date(),
      message: dto.message,
    };
    return await this.commentRepository.save(comment);
  }

  public async getAllCommentsByTask(taskId: string): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { taskId },
    });
  }
}
