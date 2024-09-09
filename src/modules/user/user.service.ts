import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UUID } from 'crypto';
import { ERRORS_DICTIONARY } from 'src/constraints/error-dictionary.constraint';
import { User } from '../../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { StudentRepository } from './repositories/student.repository';
import { TeacherRepository } from './repositories/teacher.repository';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly studentRepository: StudentRepository,
    private readonly teacherRepository: TeacherRepository
  ) { }

  async createStudent(createUserDto: CreateUserDto, parentNumber: string): Promise<User> {
    try {
      const existingUser = await this.userRepository.findUserByEmail(createUserDto.email);

      if (existingUser) {
        throw new BadRequestException({
          message: ERRORS_DICTIONARY.EMAIL_EXISTED
        });
      }

      const userData = await this.userRepository.createUser(createUserDto);

      await this.studentRepository.create(
        userData.id,
        parentNumber
      );

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

      await this.teacherRepository.create(userData.id, teacherSubject);

      return userData;
    } catch (error) {
      throw error;
    }
  }

  async findOneTeacher(id: UUID) {
    const teacherData = await this.teacherRepository.findOne(id);

    if (!teacherData) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.USER_NOT_FOUND
      });
    }

    return teacherData;
  }

  async findAll(): Promise<User[]> {
    const user = await this.userRepository.findAllUser();

    if (!user) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.USER_NOT_FOUND
      });
    }

    return user;
  }

  async findAllTeacher() {
    const teacher = await this.teacherRepository.findAll();

    if (!teacher) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.USER_NOT_FOUND
      });
    }

    return teacher;
  }

  async findOne(id: UUID): Promise<User> {
    const existingUser = await this.userRepository.findUserById(id);

    if (!existingUser) {
      throw new BadRequestException({
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

  async removeUser(id: UUID): Promise<User[]> {
    const existingUser = await this.userRepository.findUserById(id);

    if (!existingUser) {
      throw new NotFoundException({
        message: ERRORS_DICTIONARY.USER_NOT_FOUND
      });
    }

    let userRemoved = await this.userRepository.removeUser(existingUser);

    return userRemoved;
  }
}
