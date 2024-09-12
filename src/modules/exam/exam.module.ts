import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from 'src/entities/exam.entity';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';
import { JwtService } from '@nestjs/jwt';
import { Teacher } from 'src/entities/teacher.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Exam, Teacher]), UsersModule],
  controllers: [ExamController],
  providers: [ExamService, JwtService]
})
export class ExamModule {}
