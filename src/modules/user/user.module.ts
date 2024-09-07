import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from 'src/entities/student.entity';
import { Teacher } from 'src/entities/teacher.entity';
import { User } from 'src/entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './repositories/user.repository';
import { TeacherRepository } from './repositories/teacher.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, Teacher, Student])],
  controllers: [UserController],
  providers: [UserService, UserRepository, TeacherRepository]
})
export class UserModule {}
