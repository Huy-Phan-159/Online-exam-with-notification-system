import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { ERRORS_DICTIONARY } from 'src/constraints/error-dictionary.constraint';
import { Student } from 'src/entities/student.entity';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Teacher } from './../../entities/teacher.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TeacherRepository } from './repositories/teacher.repository';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: TeacherRepository
  ) {}

  async createStudent(createUserDto: CreateUserDto, parentNumber: string): Promise<User> {
    try {
      const existingUser = await this.userRepository.findUserByEmail(createUserDto.email);

      if (existingUser) {
        throw new BadRequestException({
          message: ERRORS_DICTIONARY.EMAIL_EXISTED
        });
      }

      const userData = await this.userRepository.createUser(createUserDto);

      await this.studentRepository.create({
        user: userData,
        parentNumber
      });

      return userData;
    } catch (error) {
      throw error;
    }
  }

  async createTeacher(createUserDto: CreateUserDto, teacherSubject: string): Promise<User> {
    try {
      const existingUser = await this.userRepository.findUserByEmail(createUserDto.email);

      if (existingUser) {
        throw new BadRequestException({
          message: ERRORS_DICTIONARY.EMAIL_EXISTED
        });
      }

      const userData = await this.userRepository.createUser(createUserDto);

      await this.teacherRepository.createTeacher(userData, teacherSubject);

      return userData;
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.findAllUser();
  }

  async findOne(id: UUID): Promise<User> {
    const userData = await this.userRepository.findUserById(id);

    if (!userData) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.EMAIL_EXISTED
      });
    }

    return userData;
  }

  async findUserById(id: UUID) {
    const existingUser = await this.userRepository.findUserById(id);

    if (!existingUser) {
      throw new NotFoundException({
        message: ERRORS_DICTIONARY.USER_NOT_FOUND
      });
    }

    return existingUser;
  }

  async updateUser(id: UUID, updateUserDto: UpdateUserDto) {
    const existingUser = await this.userRepository.findUserById(id);

    if (!existingUser) {
      throw new NotFoundException({
        message: ERRORS_DICTIONARY.USER_NOT_FOUND
      });
    }

    const userData = await this.userRepository.updateUser(id, updateUserDto);

    return userData;
  }

  async removeUser(id: UUID): Promise<User> {
    const existingUser = await this.userRepository.findUserById(id);

    if (!existingUser) {
      throw new NotFoundException({
        message: ERRORS_DICTIONARY.USER_NOT_FOUND
      });
    }

    let userRemoved = await this.userRepository.removeUser(existingUser);

    return existingUser;
  }
}
