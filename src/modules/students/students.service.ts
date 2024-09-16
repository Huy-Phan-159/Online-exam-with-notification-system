import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UUID } from 'crypto';
import { User } from 'src/entities/user.entity';
import { UserExistsException } from 'src/exceptions/users/userExisted.exception';
import { UserNotFoundException } from 'src/exceptions/users/userNotFound.excetion';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserPaginationDto } from '../users/dto/user-pagination.dto';
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
        throw new UserExistsException();
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const userData = await this.usersRepository.createUser({ ...createUserDto, password: hashedPassword });

      await this.studentsRepository.create(userData.id, parentNumber);

      return userData;
    } catch (error) {
      throw error;
    }
  }

  async findAll(userPagination: UserPaginationDto) {
    const { items, count } = await this.usersRepository.findAllStudent(userPagination);
    return {
      records: items,
      totalPages: Math.ceil(count / userPagination.take),
      total: count,
      limit: userPagination.take,
      page: userPagination.page
    };
  }

  async findOne(userId: UUID) {
    const student = await this.usersRepository.findOneStudent(userId);

    if (!student) {
      throw new UserNotFoundException();
    }

    return student;
  }

  async update(id: UUID, updateStudentDto: UpdateStudentDto, parentNumber: string) {
    const existingUser = await this.usersRepository.findUserById(id);

    if (!existingUser) {
      throw new UserNotFoundException();
    }

    const userData = await this.usersRepository.update(id, updateStudentDto);

    await this.studentsRepository.update(existingUser.student.id, parentNumber);

    return userData;
  }

  async remove(userId: UUID) {
    const existingUser = await this.usersRepository.findUserById(userId);

    if (!existingUser) {
      throw new UserNotFoundException();
    }

    const userDeleted = await this.usersRepository.delete(userId);

    await this.studentsRepository.delete(existingUser.id);

    return userDeleted;
  }
}
