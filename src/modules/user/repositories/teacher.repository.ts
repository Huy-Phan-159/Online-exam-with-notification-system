import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { Teacher } from 'src/entities/teacher.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TeacherRepository {
  constructor(@InjectRepository(Teacher) private readonly teacherRepository: Repository<Teacher>) {}

  async create(userData, subject) {
    const teacherData = await this.teacherRepository.create({
      user: userData,
      subject
    });

    const teacherCreated = await this.teacherRepository.save(teacherData);

    return teacherCreated;
  }

  async findOne(userId: UUID) {
    return await this.teacherRepository.findOne({
      where: {
        user: { id: userId }
      },
      relations: {
        user: true
      }
    });
  }

  async findAll() {
    return await this.teacherRepository.findAndCount({
      relations: {
        user: true
      }
    });
  }

  async findAny(userId) {
    return await this.teacherRepository.find({
      where: {
        user: { id: userId },
        deletedAt: null
      }
    });
  }

  async delete(userId) {
    return await this.teacherRepository.softDelete({ user: { id: userId } });
  }
}
