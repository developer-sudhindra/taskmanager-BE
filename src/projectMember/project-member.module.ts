import { Module } from '@nestjs/common';
import { ProjectMemberController } from './project-member.controller';
import { ProjectMemberService } from './project-member.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectMember } from './project-member.entity';

@Module({
  controllers: [ProjectMemberController],
  providers: [ProjectMemberService],
  imports: [TypeOrmModule.forFeature([ProjectMember])],
  exports: [ProjectMemberService, TypeOrmModule],
})
export class ProjectMemberModule {}
