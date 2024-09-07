import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const userCreated = this.userRepository.create(createUserDto);
    this.userRepository.save(userCreated);
    return userCreated;
  }

  async findAllUser() {
    return await this.userRepository.find();
  }
  async findUserByEmail(email: string) {
    return await this.userRepository.findOne({
      where: {
        email
      }
    });
  }
  async findUserById(id: UUID) {
    return await this.userRepository.findOne({
      where: {
        id
      }
    });
  }
  async updateUser(id: UUID, updateUserDto: UpdateUserDto) {
    const userUpdated = await this.userRepository.update({ id }, { ...updateUserDto });

    return userUpdated;
    }
    
    async removeUser(user) {
        return await this.userRepository.remove(user);
    }
}
