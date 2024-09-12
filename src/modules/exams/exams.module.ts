import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from 'src/entities/exam.entity';
import { ExamsController } from './exams.controller';
import { ExamsService } from './exams.service';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Exam]), UsersModule],
  controllers: [ExamsController],
  providers: [ExamsService, JwtService]
})
export class ExamsModule {}
