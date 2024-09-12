import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { FindOptionsWhere, Repository, UpdateResult } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UUID } from 'crypto';
import { error } from 'console';
import { ERRORS_DICTIONARY } from 'src/constraints/error-dictionary.constraint';

export class CategoriesRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const newCategory = this.categoriesRepository.create(createCategoryDto);

    return await this.categoriesRepository.save(newCategory).catch((error) => {
      throw error;
    });
  }

  async findAll(
    page: number,
    limit: number,
    whereConditions: FindOptionsWhere<Category>
  ): Promise<[Category[], number]> {
    const skip = (page - 1) * limit;

    return await this.categoriesRepository
      .findAndCount({
        where: whereConditions,
        withDeleted: false,
        skip: skip,
        take: limit
      })
      .then((result) => {
        const [foundCategories, total] = result;
        if (!total) throw new Error(ERRORS_DICTIONARY.NOT_FOUND_ANY_CATEGORY);

        return result;
      })
      .catch((error) => {
        throw error;
      });
  }

  async findOne(id: UUID): Promise<Category> {
    return await this.categoriesRepository
      .findOne({
        where: { id },
        withDeleted: false
      })
      .then((foundCategory) => {
        if (!foundCategory) throw new Error(ERRORS_DICTIONARY.NOT_FOUND_ANY_CATEGORY);

        return foundCategory;
      })
      .catch((error) => {
        throw error;
      });
  }

  async update(id: UUID, updateCategoryDto): Promise<UpdateResult> {
    return await this.categoriesRepository
      .update(id, updateCategoryDto)
      .then()
      .catch((error) => {
        throw error;
      });
  }

  async remove(id: UUID): Promise<UpdateResult> {
    return await this.categoriesRepository
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
