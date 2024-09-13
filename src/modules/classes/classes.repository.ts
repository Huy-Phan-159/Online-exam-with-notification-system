import { CreateClassDto } from './dto/create-class.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { Class } from 'src/entities/class.entity';
import { StudentClass } from 'src/entities/student-class.entity';
import { FindOptionsWhere, QueryFailedError, Repository, UpdateResult } from 'typeorm';
import { UpdateClassDto } from './dto/update-class.dto';
import { ERRORS_DICTIONARY } from 'src/constraints/error-dictionary.constraint';

export class ClassesRepository {
  constructor(
    @InjectRepository(Class)
    private readonly classesRepository: Repository<Class>,
    @InjectRepository(StudentClass)
    private readonly studentClassRepository: Repository<StudentClass>
  ) {}

  private async saveStudentClass(studentId: UUID, classId: UUID) {
    const newStudentClass = this.studentClassRepository.create({
      class: { id: classId },
      student: { id: studentId }
    });

    await this.studentClassRepository.save(newStudentClass);
  }

  async create(createClassDto: CreateClassDto): Promise<Class> {
    const newClass = this.classesRepository.create(createClassDto);

    return await this.classesRepository
      .save(newClass)
      .then(async (savedClass) => {
        await Promise.all(
          createClassDto.studentIds.map((studentId) => this.saveStudentClass(studentId, savedClass.id))
        );

        return savedClass;
      })
      .catch((error) => {
        throw error;
      });
  }

  async findAll(
    page: number,
    limit: number,
    whereConditions: FindOptionsWhere<Class>
  ): Promise<[Class[], number]> {
    const skip = (page - 1) * limit;

    return await this.classesRepository
      .findAndCount({
        where: whereConditions,
        withDeleted: false,
        skip: skip,
        take: limit
      })
      .then((result) => {
        const [foundClass, total] = result;
        if (!total) throw new Error(ERRORS_DICTIONARY.NOT_FOUND_ANY_CLASS);

        return result;
      })
      .catch((error) => {
        throw error;
      });
  }

  async findOne(id: UUID): Promise<Class> {
    return await this.classesRepository
      .findOne({
        where: { id },
        withDeleted: false,
        relations: {
          studentClass: true,
          examClass: true
        }
      })
      .then((foundClass) => {
        if (!foundClass) throw new Error(ERRORS_DICTIONARY.NOT_FOUND_ANY_CLASS);

        return foundClass;
      })
      .catch((error) => {
        throw error;
      });
  }

  async update(id: UUID, updateClassDto: UpdateClassDto): Promise<Class> {
    const { studentIds, ...updateFields } = updateClassDto;

    await this.classesRepository.update(id, updateFields).catch((error) => {
      throw error;
    });

    if (studentIds && studentIds.length)
      await this.findOne(id)
        .then((foundClass) => {
          foundClass.studentClass.forEach(async (studentClass) => {
            await this.studentClassRepository.delete(studentClass.id);
          });

          studentIds.forEach(async (studentId) => {
            await this.saveStudentClass(studentId, id);
          });
        })
        .catch((error) => {
          throw error;
        });

    return this.findOne(id);
  }

  async remove(id: UUID): Promise<UpdateResult> {
    return await this.classesRepository
      .softDelete(id)
      .then((updateResult) => {
        if (!updateResult.affected) throw new Error(ERRORS_DICTIONARY.NOT_RECORD_WAS_DELETED);

        return updateResult;
      })
      .catch((error) => {
        throw error;
      });
  }
}
