import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Class } from 'src/entities/class.entity';
import { ILike, Repository } from 'typeorm';
import { StudentClass } from 'src/entities/student-class.entity';
import { PaginationResult } from 'src/shared/interfaces/pagination-result.interface';
import { UUID } from 'crypto';
import { ResponseException } from 'src/exceptions/response/response.exception';
import { ERRORS_DICTIONARY } from 'src/constraints/error-dictionary.constraint';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private readonly classesRepository: Repository<Class>,
    @InjectRepository(StudentClass)
    private readonly studentClassRepository: Repository<StudentClass>
  ) {}

  async create(createClassDto: CreateClassDto) {
    return 'This action adds a new class';
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    searchQueries: Record<string, any> = {}
  ): Promise<PaginationResult<Class>> {
    const whereConditions = Object.entries(searchQueries).reduce((acc, [key, value]) => {
      acc[key] = typeof value === 'string' ? ILike(`%${value}%`) : value;
      return acc;
    }, {});

    const skip = (page - 1) * limit;

    return await this.classesRepository
      .findAndCount({
        where: whereConditions,
        withDeleted: false,
        skip: skip,
        take: limit,
        relations: {
          studentClass: true,
          examClass: true
        }
      })
      .then(([records, total]) => {
        const totalPages = Math.ceil(total / limit);

        return {
          records,
          total,
          page,
          limit,
          totalPages
        };
      });
  }

  async findOne(id: UUID) {
    return await this.classesRepository
      .findOne({
        where: { id },
        withDeleted: false,
        relations: {
          studentClass: true
        }
      })
      .then((classData) => {
        if (!classData) {
          throw new BadRequestException(
            new ResponseException(ERRORS_DICTIONARY.NOT_FOUND_ANY_CLASS, [
              `Not found any class has id=${id} in DB`
            ])
          );
        }

        return classData;
      });
  }

  async update(id: UUID, updateClassDto: UpdateClassDto) {
    return `This action updates a #${id} class`;
  }

  async remove(id: UUID) {
    return `This action removes a #${id} class`;
  }
}
