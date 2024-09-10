import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from 'src/entities/teacher.entity';
import { UsersModule } from '../users/users.module';
import { TeachersService } from './teacher.service';
import { TeachersController } from './teachers.controller';
import { TeachersRepository } from './teachers.repository';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Teacher])],
  controllers: [TeachersController],
  providers: [TeachersService, TeachersRepository]
})
export class TeachersModule {}
