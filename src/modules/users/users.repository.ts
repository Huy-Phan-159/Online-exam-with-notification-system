import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { Role } from 'src/entities/enums/role.enum';
import { User } from 'src/entities/user.entity';
import { ILike, Like, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserPaginationDto } from './dto/user-pagination.dto';
import { ERRORS_DICTIONARY } from 'src/constraints/error-dictionary.constraint';

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

  async findAllUser(userPagination: UserPaginationDto) {
    const { page, take, firstName, lastName } = userPagination;

    const takeData = take || 10;

    const skip = (page - 1) * take;

    const [items, count] = await this.usersRepository.findAndCount({
      relations: {
        student: true,
        teacher: true
      },
      where: {
        firstName: firstName ? ILike(`%${firstName}%`) : Like(`%%`),
        lastName: lastName ? ILike(`%${lastName}%`) : Like(`%%`)
      },
      take: takeData,
      skip
    });

    return { items, count };
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: {
        email
      }
    });
  }
  async findUserById(userId: UUID): Promise<User> {
    return await this.usersRepository.findOne({
      where: {
        id: userId
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

  async findAllTeacher(userPagination: UserPaginationDto) {
    const { page, take, firstName, lastName } = userPagination;

    const takeData = take || 10;

    const skip = (page - 1) * take;

    return await this.usersRepository.findAndCount({
      where: {
        role: Role.TEACHER,
        firstName: firstName ? ILike(`%${firstName}%`) : Like(`%%`),
        lastName: lastName ? ILike(`%${lastName}%`) : Like(`%%`)
      },
      relations: {
        teacher: true
      },
      take: takeData,
      skip
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

  async findAllStudent(userPagination: UserPaginationDto) {
    const { page, take, firstName, lastName } = userPagination;

    const takeData = take || 10;

    const skip = (page - 1) * take;

    return await this.usersRepository.findAndCount({
      where: {
        role: Role.STUDENT,
        firstName: firstName ? ILike(`%${firstName}%`) : Like(`%%`),
        lastName: lastName ? ILike(`%${lastName}%`) : Like(`%%`)
      },
      relations: {
        student: true
      },
      take: takeData,
      skip
    });
  }

  async update(userId: UUID, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    const userUpdated = await this.usersRepository.update(userId, { ...updateUserDto });

    return userUpdated;
  }

  async delete(userId: UUID): Promise<UpdateResult> {
    return await this.usersRepository.softDelete(userId);
  }
  async updatePassword(newPassword: string, userId: UUID) {
    const foundUser = await this.findUserById(userId);
    if (!foundUser) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.USER_NOT_FOUND
      });
    }
    foundUser.password = newPassword;
    const { raw } = await this.usersRepository.update(
      {
        id: userId
      },
      {
        password: newPassword
      }
    );

    return raw;
  }
}
