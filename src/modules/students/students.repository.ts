import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { Student } from 'src/entities/student.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StudentsRepository {
  constructor(@InjectRepository(Student) private readonly studentsRepository: Repository<Student>) {}

  async create(userData, parentNumber: string): Promise<Student> {
    const studentData = await this.studentsRepository.create({
      user: userData,
      parentNumber
    });

    const studentCreated = await this.studentsRepository.save(studentData);

    return studentCreated;
  }

  async update(id: UUID, parentNumber: string) {
    return this.studentsRepository.update(id, { parentNumber });
  }

  async delete(userId: UUID) {
    return this.studentsRepository.softDelete({ user: { id: userId } });
  }
}
