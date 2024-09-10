import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UUID } from 'crypto';
import { ERRORS_DICTIONARY } from 'src/constraints/error-dictionary.constraint';
import { User } from '../../entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findAll(): Promise<User[]> {
    const users = await this.usersRepository.findAllUser();

    if (!users) {
      throw new NotFoundException({
        message: ERRORS_DICTIONARY.USER_NOT_FOUND
      });
    }

    return users;
  }

  async findOne(id: UUID): Promise<User> {
    const existingUser = await this.usersRepository.findUserById(id);

    if (!existingUser) {
      throw new NotFoundException({
        message: ERRORS_DICTIONARY.USER_NOT_FOUND
      });
    }

    return existingUser;
  }

  async updateUser(id: UUID, updateUserDto: UpdateUserDto) {
    const existingUser = await this.usersRepository.findUserById(id);

    if (!existingUser) {
      throw new NotFoundException({
        message: ERRORS_DICTIONARY.USER_NOT_FOUND
      });
    }

    const userData = await this.usersRepository.update(id, updateUserDto);

    return userData;
  }
}
