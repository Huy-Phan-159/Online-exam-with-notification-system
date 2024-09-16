import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Result } from 'src/entities/result.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { ResultsController } from './results.controller';
import { ResultsService } from './results.service';
import { ExamsModule } from '../exams/exams.module';
import { HistoryAnswer } from 'src/entities/history-answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Result, HistoryAnswer]), UsersModule, ExamsModule],
  controllers: [ResultsController],
  providers: [ResultsService, JwtService]
})
export class ResultsModule {}
