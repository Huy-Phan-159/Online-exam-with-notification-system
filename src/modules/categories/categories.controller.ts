import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';
import { UUID } from 'crypto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoriesService.create(createCategoryDto);
  }

  @Get()
  async findAll(@Query() queryCategoryDto: QueryCategoryDto) {
    const { page, limit, ...searchQueries } = queryCategoryDto;

    return await this.categoriesService.findAll(page, limit, searchQueries);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: UUID) {
    return await this.categoriesService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id', new ParseUUIDPipe()) id: UUID, @Body() updateCategoryDto: UpdateCategoryDto) {
    return await this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe()) id: UUID) {
    return await this.categoriesService.remove(id);
  }
}
