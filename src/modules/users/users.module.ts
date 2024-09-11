import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from 'src/entities/student.entity';
import { Teacher } from 'src/entities/teacher.entity';
import { User } from 'src/entities/user.entity';

import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Teacher, Student])],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersRepository, UsersService]
})
export class UsersModule {}
