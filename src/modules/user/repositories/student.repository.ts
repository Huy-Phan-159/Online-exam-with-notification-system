import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Student } from "src/entities/student.entity";
import { Repository } from "typeorm";

@Injectable()
export class StudentRepository {
  constructor(@InjectRepository(Student) private readonly studentRepository: Repository<Student>) {}

  async createTeacher(userData, parentNumber) {
    const studentCreated = await this.studentRepository.create({
      user: userData,
      parentNumber
    });

    await this.studentRepository.save(studentCreated);

    return studentCreated;
  }
}
