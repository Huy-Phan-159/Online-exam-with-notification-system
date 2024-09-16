import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UUID } from 'crypto';
import { User } from 'src/entities/user.entity';
import { UserExistsException } from 'src/exceptions/users/userExisted.exception';
import { UserNotFoundException } from 'src/exceptions/users/userNotFound.excetion';
import { UpdateResult } from 'typeorm';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserPaginationDto } from '../users/dto/user-pagination.dto';
import { UsersRepository } from '../users/users.repository';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { TeachersRepository } from './teachers.repository';

@Injectable()
export class TeachersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly teachersRepository: TeachersRepository
  ) {}
  async create(createUserDto: CreateUserDto, teacherSubject: string): Promise<User> {
    try {
      const existingUser = await this.usersRepository.findUserByEmail(createUserDto.email);

      if (existingUser) {
        throw new UserExistsException();
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const userData = await this.usersRepository.createUser({ ...createUserDto, password: hashedPassword });

      await this.teachersRepository.create(userData, teacherSubject);

      return userData;
    } catch (error) {
      throw error;
    }
  }

  async findAll(userPagination: UserPaginationDto) {
    const { items, count } = await this.usersRepository.findAllTeacher(userPagination);

    return {
      records: items,
      totalPages: Math.ceil(count / userPagination.take),
      total: count,
      limit: userPagination.take,
      page: userPagination.page
    };
  }

  async findOne(userId: UUID): Promise<User> {
    const teacherData = await this.usersRepository.findOneTeacher(userId);

    if (!teacherData) {
      throw new UserNotFoundException();
    }

    return teacherData;
  }

  async update(
    userId: UUID,
    updateTeacherDto: UpdateTeacherDto,
    teacherSubject: string
  ): Promise<UpdateResult> {
    const existingUser = await this.usersRepository.findUserById(userId);

    if (!existingUser) {
      throw new UserNotFoundException();
    }

    const userData = await this.usersRepository.update(userId, updateTeacherDto);

    await this.teachersRepository.update(existingUser.teacher.id, teacherSubject);

    return userData;
  }

  async remove(userId: UUID) {
    const existingUser = await this.usersRepository.findUserById(userId);

    if (!existingUser) {
      throw new UserNotFoundException();
    }

    await this.teachersRepository.delete(existingUser.id);

    return await this.usersRepository.delete(userId);
  }
}
