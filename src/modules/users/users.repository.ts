import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { Role } from 'src/entities/enums/role.enum';
import { User } from 'src/entities/user.entity';
import { ILike, Like, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserPaginationDto } from './dto/user-pagination.dto';

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

    const [items, count] = await this.usersRepository.findAndCount({
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
    return { items, count };
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

    const [items, count] = await this.usersRepository.findAndCount({
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

    return {
      items,
      count
    };
  }

  async update(userId: UUID, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    const userUpdated = await this.usersRepository.update(userId, { ...updateUserDto });

    return userUpdated;
  }

  async delete(userId: UUID): Promise<UpdateResult> {
    return await this.usersRepository.softDelete(userId);
  }
}
