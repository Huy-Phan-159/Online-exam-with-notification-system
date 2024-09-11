import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { ApiTags } from '@nestjs/swagger';
import { QueryClassDto } from './dto/query-class.dto';
import { UUID } from 'crypto';

@Controller('classes')
@ApiTags('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  create(@Body() createClassDto: CreateClassDto) {
    return this.classesService.create(createClassDto);
  }

  @Get()
  async findAll(@Query() queryClassDto: QueryClassDto) {
    const { page, limit, ...searchQueries } = queryClassDto;

    return await this.classesService.findAll(page, limit, searchQueries);
  }

  @Get(':id')
  async findOne(@Param('id') id: UUID) {
    return await this.classesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: UUID, @Body() updateClassDto: UpdateClassDto) {
    return this.classesService.update(id, updateClassDto);
  }

  @Delete(':id')
  remove(@Param('id') id: UUID) {
    return this.classesService.remove(id);
  }
}
