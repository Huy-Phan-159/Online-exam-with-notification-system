import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { ApiTags } from '@nestjs/swagger';
import { QueryClassDto } from './dto/query-class.dto';
import { UUID } from 'crypto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('classes')
@ApiTags('classes')
@UseGuards(JwtAuthGuard)
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  async create(@Body() createClassDto: CreateClassDto) {
    return await this.classesService.create(createClassDto);
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
  async update(@Param('id') id: UUID, @Body() updateClassDto: UpdateClassDto) {
    return await this.classesService.update(id, updateClassDto);
  }

  @Delete(':id')
  remove(@Param('id') id: UUID) {
    return this.classesService.remove(id);
  }
}
