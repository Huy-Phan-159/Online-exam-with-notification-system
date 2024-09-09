import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UUID } from "crypto";
import { Student } from "src/entities/student.entity";
import { Repository } from "typeorm";

@Injectable()
export class StudentRepository {
  constructor(@InjectRepository(Student) private readonly studentRepository: Repository<Student>) {}

  async create(userData, parentNumber: string) {
    const studentData = await this.studentRepository.create({
      user: userData,
      parentNumber
    });

    const studentCreated = await this.studentRepository.save(studentData);

    return studentCreated;
  }

  async delete(userId: UUID) {
    return this.studentRepository.softDelete({user: {id: userId}});
  }
}
