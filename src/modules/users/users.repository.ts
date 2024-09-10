import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { Role } from 'src/entities/enums/role.enum';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { userSelectFields } from './user-select-fields';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);

    const userCreated = await this.usersRepository.save(user);

    return userCreated;
  }

  async findAllUser(): Promise<User[]> {
    return await this.usersRepository.find({
      select: userSelectFields
    });
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: {
        email
      },
      select: userSelectFields
    });
  }
  async findUserById(id: UUID): Promise<User> {
    return await this.usersRepository.findOne({
      where: {
        id
      },
      select: userSelectFields
    });
  }

  async findOneTeacher(userId: UUID): Promise<User> {
    return await this.usersRepository.findOne({
      where: {
        id: userId
      },
      select: userSelectFields,
      relations: {
        teacher: true
      }
    });
  }

  async findAllTeacher(): Promise<User[]> {
    return await this.usersRepository.find({
      where: {
        role: Role.TEACHER
      },
      select: userSelectFields,
      relations: {
        teacher: true
      }
    });
  }

  async findOneStudent(userId: UUID): Promise<User> {
    return await this.usersRepository.findOne({
      where: {
        id: userId
      },
      select: userSelectFields,
      relations: {
        student: true
      }
    });
  }

  async findAllStudent(): Promise<User[]> {
    return await this.usersRepository.find({
      where: {
        role: Role.STUDENT
      },
      select: userSelectFields,
      relations: {
        student: true
      }
    });
  }

  async update(id: UUID, updateUserDto: UpdateUserDto) {
    const userUpdated = await this.usersRepository.update({ id }, { ...updateUserDto });

    return userUpdated;
  }

  async delete(userId) {
    return await this.usersRepository.softDelete(userId);
  }
}
