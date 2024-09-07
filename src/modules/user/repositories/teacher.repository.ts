import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from 'src/entities/teacher.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TeacherRepository {
  constructor(@InjectRepository(Teacher) private readonly teacherRepository: Repository<Teacher>) {}

  async createTeacher(userData, subject) {
    const teacherCreated = await this.teacherRepository.create({
      user: userData,
      subject
    });

      await this.teacherRepository.save(teacherCreated);
      
    return teacherCreated;
  }
}
