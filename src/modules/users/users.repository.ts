import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { Role } from 'src/entities/enums/role.enum';
import { User } from 'src/entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.usersRepository.create(createUserDto);

    return await this.usersRepository.save(user);

  }

  async findAllUser(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: {
        email
      }
    });
  }
  async findUserById(id: UUID): Promise<User> {
    return await this.usersRepository.findOne({
      where: {
        id
      },
      relations: {
        teacher: true,
        student: true
      }
    });
  }

  async findOneTeacher(userId: UUID): Promise<User> {
    return await this.usersRepository.findOne({
      where: {
        id: userId
      },
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
      relations: {
        student: true
      }
    });
  }

  async update(userId: UUID, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    const userUpdated = await this.usersRepository.update(userId, { ...updateUserDto });

    return userUpdated;
  }

  async delete(userId: UUID): Promise<UpdateResult> {
    return await this.usersRepository.softDelete(userId);
  }
}
