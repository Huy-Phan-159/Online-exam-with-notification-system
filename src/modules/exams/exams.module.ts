import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from 'src/entities/exam.entity';
import { ExamsController } from './exams.controller';
import { ExamsService } from './exams.service';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { ExamQuestion } from 'src/entities/exam-question.entity';
import { QuestionsModule } from '../questions/questions.module';
import { ExamClass } from 'src/entities/exam-class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exam, ExamQuestion, ExamClass]), UsersModule, QuestionsModule],
  controllers: [ExamsController],
  providers: [ExamsService, JwtService]
})
export class ExamsModule {}
