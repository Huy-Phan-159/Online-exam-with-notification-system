import { CategoriesRepository } from './categories.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ResponseException } from 'src/exceptions/response/response.exception';
import { ILike } from 'typeorm';
import { PaginationResult } from 'src/shared/interfaces/pagination-result.interface';
import { Category } from 'src/entities/category.entity';
import { UUID } from 'crypto';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return await this.categoriesRepository.create(createCategoryDto).catch((error) => {
      throw new BadRequestException(new ResponseException(error.message));
    });
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    searchQueries: Record<string, any> = {}
  ): Promise<PaginationResult<Category>> {
    const whereConditions = Object.entries(searchQueries).reduce((acc, [key, value]) => {
      acc[key] = typeof value === 'string' ? ILike(`%${value}%`) : value;
      return acc;
    }, {});

    return await this.categoriesRepository
      .findAll(page, limit, whereConditions)
      .then(([records, total]) => {
        const totalPages = Math.ceil(total / limit);

        return {
          records,
          total,
          page,
          limit,
          totalPages
        };
      })
      .catch((error) => {
        throw new BadRequestException(new ResponseException(error.message));
      });
  }

  async findOne(id: UUID) {
    return await this.categoriesRepository.findOne(id).catch((error) => {
      throw new BadRequestException(new ResponseException(error.message));
    });
  }

  async update(id: UUID, updateCategoryDto: UpdateCategoryDto) {
    return await this.categoriesRepository.update(id, updateCategoryDto).catch((error) => {
      throw new BadRequestException(new ResponseException(error.message));
    });
  }

  async remove(id: UUID) {
    return await this.categoriesRepository.remove(id).catch((error) => {
      throw new BadRequestException(new ResponseException(error.message));
    });
  }
}
