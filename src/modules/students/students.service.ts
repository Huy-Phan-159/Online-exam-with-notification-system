import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UUID } from 'crypto';
import { ERRORS_DICTIONARY } from 'src/constraints/error-dictionary.constraint';
import { User } from 'src/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersRepository } from '../users/users.repository';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentsRepository } from './students.repository';

@Injectable()
export class StudentsService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly studentsRepository: StudentsRepository
  ) {}

  async create(createUserDto: CreateUserDto, parentNumber: string): Promise<User> {
    try {
      const existingUser = await this.usersRepository.findUserByEmail(createUserDto.email);

      if (existingUser) {
        throw new BadRequestException({
          message: ERRORS_DICTIONARY.EMAIL_EXISTED
        });
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const userData = await this.usersRepository.createUser({ ...createUserDto, password: hashedPassword });

      await this.studentsRepository.create(userData.id, parentNumber);

      return userData;
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    const students = await this.usersRepository.findAllStudent();

    if (!students) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.USER_NOT_FOUND
      });
    }

    return students;
  }

  async findOne(userId: UUID) {
    const student = await this.usersRepository.findOneStudent(userId);

    if (!student) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.USER_NOT_FOUND
      });
    }
    return student;
  }

  async update(id: UUID, updateStudentDto: UpdateStudentDto, parentNumber: string) {
    const existingUser = await this.usersRepository.findUserById(id);

    if (!existingUser) {
      throw new NotFoundException({
        message: ERRORS_DICTIONARY.USER_NOT_FOUND
      });
    }

    const userData = await this.usersRepository.update(id, updateStudentDto);

    await this.studentsRepository.update(existingUser.student.id, parentNumber);

    return userData;
  }

  async remove(userId: UUID) {
    const existingUser = await this.usersRepository.findUserById(userId);

    if (!existingUser) {
      throw new NotFoundException({
        message: ERRORS_DICTIONARY.USER_NOT_FOUND
      });
    }

    const userDeleted = await this.usersRepository.delete(userId);

    await this.studentsRepository.delete(existingUser.id);

    return userDeleted;
  }
}
