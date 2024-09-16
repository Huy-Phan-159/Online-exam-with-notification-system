import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UUID } from 'crypto';
import { UserNotFoundException } from 'src/exceptions/users/userNotFound.excetion';
import { ApiConfigService } from 'src/shared/services/api-config.service';
import { UpdateResult } from 'typeorm';
import { User } from '../../entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserPaginationDto } from './dto/user-pagination.dto';
import { UsersRepository } from './users.repository';
import { ERRORS_DICTIONARY } from 'src/constraints/error-dictionary.constraint';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly configService: ApiConfigService
  ) {}

  async findAll(userPagination: UserPaginationDto) {
    return await this.usersRepository.findAllUser(userPagination);
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

  async updatePassword(newPassword: string, userId: UUID) {
    await this.findOne(userId);
    const raw = await this.usersRepository.updatePassword(newPassword, userId);
    if (raw === 0) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.RESET_PASSWORD_FAIL
      });
    }
    return raw;
  }
  
  async createInitialUser() {
    // Check if the user exists
    const existingUser = await this.usersRepository.findUserByEmail('admin@gmail.com');

    const password = '123';

    if (!existingUser) {
      const newUser = this.configService.adminInfo;
      
      newUser.password = await bcrypt.hash(newUser.password, 10);

      await this.usersRepository.createUser(newUser);
    }
  }
  
}
