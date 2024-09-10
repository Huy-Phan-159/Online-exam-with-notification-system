import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from 'src/entities/teacher.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TeachersRepository {
  constructor(@InjectRepository(Teacher) private readonly teachersRepository: Repository<Teacher>) {}

  async create(userData, subject): Promise<Teacher> {
    const teacherData = await this.teachersRepository.create({
      user: userData,
      subject
    });

    const teacherCreated = await this.teachersRepository.save(teacherData);

    return teacherCreated;
  }
  async update(teacherId, subject) {
    return this.teachersRepository.update(teacherId, { subject });
  }

  async delete(userId) {
    return await this.teachersRepository.softDelete({ user: { id: userId } });
  }
}
