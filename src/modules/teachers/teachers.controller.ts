import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseInterceptors
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UUID } from 'crypto';
import { LoggingInterceptor } from 'src/interceptors/logging.interceptor';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { TeachersService } from './teacher.service';

@Controller('teacher')
@ApiTags('Teacher')
@UseInterceptors(LoggingInterceptor)
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  @ApiCreatedResponse({ description: 'The teacher has been successfully created.' })
  async create(@Body() createTeacherDto: CreateTeacherDto) {
    try {
      const data = await this.teachersService.create(createTeacherDto, createTeacherDto.subject);

      return {
        success: true,
        data,
        message: 'Teacher Created Successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message
      };
    }
  }

  @Get()
  async findAll() {
    try {
      const data = await this.teachersService.findAll();
      return {
        success: true,
        data,
        message: 'Teacher Fetched Successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Get teacher by id successfully' })
  async findOne(@Param('id', ParseUUIDPipe) id: UUID) {
    try {
      const data = await this.teachersService.findOne(id);
      return {
        success: true,
        data,
        message: 'Teacher Fetched Successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message
      };
    }
  }

  @ApiCreatedResponse({ description: 'The teacher has been successfully updated.' })
  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: UUID, @Body() updateTeacherDto: UpdateTeacherDto) {
    try {
      const data = await this.teachersService.update(id, updateTeacherDto, updateTeacherDto.subject);
      return {
        success: true,
        data,
        message: 'Teacher Updated Successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message
      };
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: UUID) {
    try {
      const data = await this.teachersService.remove(id);
      return {
        success: true,
        data,
        message: 'Teacher Deleted Successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message
      };
    }
  }
}
