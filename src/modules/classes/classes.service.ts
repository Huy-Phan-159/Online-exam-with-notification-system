import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable, Catch } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Class } from 'src/entities/class.entity';
import { ILike, QueryFailedError, Repository } from 'typeorm';
import { StudentClass } from 'src/entities/student-class.entity';
import { PaginationResult } from 'src/shared/interfaces/pagination-result.interface';
import { UUID } from 'crypto';
import { ResponseException } from 'src/exceptions/response/response.exception';
import { ERRORS_DICTIONARY } from 'src/constraints/error-dictionary.constraint';
import { ClassesRepository } from './classes.repository';

@Injectable()
export class ClassesService {
  constructor(private readonly classesRepository: ClassesRepository) {}

  async create(createClassDto: CreateClassDto) {
    return await this.classesRepository.create(createClassDto).catch((error) => {
      throw new BadRequestException(new ResponseException(error.message));
    });
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

    return await this.classesRepository.findAll(page, limit, whereConditions).then(([records, total]) => {
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

  async findOne(id: UUID, searchQueries: Record<string, any> = {}) {
    const whereConditions = Object.entries(searchQueries).reduce((acc, [key, value]) => {
      acc[key] = typeof value === 'string' ? ILike(`%${value}%`) : value;
      return acc;
    }, {});

    return this.classesRepository
      .findOne(id, whereConditions)
      .then((classData) => {
        if (!classData) {
          throw new BadRequestException(
            new ResponseException(ERRORS_DICTIONARY.NOT_FOUND_ANY_CLASS, [
              `Not found any class has id=${id} in DB`
            ])
          );
        }

        return classData;
      })
      .catch((error) => {
        throw new BadRequestException(new ResponseException(error.message));
      });
  }

  async update(id: UUID, updateClassDto: UpdateClassDto) {
    return this.classesRepository.update(id, updateClassDto).catch((error) => {
      throw new BadRequestException(new ResponseException(error.message));
    });
  }

  async remove(id: UUID) {
    return this.classesRepository.remove(id).catch((error) => {
      throw new BadRequestException(new ResponseException(error.message));
    });
  }
}
