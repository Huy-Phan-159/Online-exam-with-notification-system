import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from 'src/entities/student.entity';
import { StudentsRepository } from './students.repository';
import { StudentsService } from './students.service';
import { UsersModule } from '../users/users.module';
import { StudentsController } from './students.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Student])],
  controllers: [StudentsController],
  providers: [StudentsService, StudentsRepository, JwtService]
})
export class StudentsModule {}
