import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { UsersModule } from '../users/users.module';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from 'src/entities/question.entity';
import { Option } from 'src/entities/option.entity'; // Import the Option entity
import { Teacher } from 'src/entities/teacher.entity';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Question, Option, Teacher])],
  controllers: [FilesController],
  providers: [FilesService, JwtService]
})
export class FilesModule {}
