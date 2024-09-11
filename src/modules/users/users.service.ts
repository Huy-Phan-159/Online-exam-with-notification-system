import { Injectable } from '@nestjs/common';
import { UUID } from 'crypto';
import { UserNotFoundException } from 'src/exceptions/users/userNotFound.excetion';
import { UpdateResult } from 'typeorm';
import { User } from '../../entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findAll(): Promise<User[]> {
    return await this.usersRepository.findAllUser();
  }

  async findOne(userId: UUID): Promise<User> {
    const existingUser = await this.usersRepository.findUserById(userId);

    if (!existingUser) {
      throw new UserNotFoundException();
    }

    return existingUser;
  }

  async findOneByEmail(email: string): Promise<User> {
    const existingUser = await this.usersRepository.findUserByEmail(email);

    if (!existingUser) {
      throw new UserNotFoundException();
    }

    return existingUser;
  }

  async updateUser(userId: UUID, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    const existingUser = await this.usersRepository.findUserById(userId);

    if (!existingUser) {
      throw new UserNotFoundException();
    }

    return await this.usersRepository.update(userId, updateUserDto);
  }
}
