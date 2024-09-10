import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UUID } from 'crypto';
import { ERRORS_DICTIONARY } from 'src/constraints/error-dictionary.constraint';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersRepository } from '../users/users.repository';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { TeachersRepository } from './teachers.repository';

@Injectable()
export class TeachersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly teachersRepository: TeachersRepository
  ) {}
  async create(createUserDto: CreateUserDto, teacherSubject: string) {
    try {
      const existingUser = await this.usersRepository.findUserByEmail(createUserDto.email);

      if (existingUser) {
        throw new BadRequestException({
          message: ERRORS_DICTIONARY.EMAIL_EXISTED
        });
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const userData = await this.usersRepository.createUser({ ...createUserDto, password: hashedPassword });

      await this.teachersRepository.create(userData, teacherSubject);

      return userData;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    const teacher = await this.usersRepository.findAllTeacher();

    if (!teacher) {
      throw new NotFoundException({
        message: ERRORS_DICTIONARY.USER_NOT_FOUND
      });
    }

    return teacher;
  }

  async findOne(id: UUID) {
    const teacherData = await this.usersRepository.findOneTeacher(id);

    if (!teacherData) {
      throw new NotFoundException({
        message: ERRORS_DICTIONARY.USER_NOT_FOUND
      });
    }

    teacherData.password = undefined;

    return teacherData;
  }

  async update(id: UUID, updateTeacherDto: UpdateTeacherDto, teacherSubject: string) {
    const existingUser = await this.usersRepository.findUserById(id);

    if (!existingUser) {
      throw new NotFoundException({
        message: ERRORS_DICTIONARY.USER_NOT_FOUND
      });
    }

    const userData = await this.usersRepository.update(id, updateTeacherDto);

    await this.teachersRepository.update(existingUser.teacher.id, teacherSubject);

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

    await this.teachersRepository.delete(existingUser.id);

    return userDeleted;
  }
}
