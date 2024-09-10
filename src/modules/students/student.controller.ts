import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UUID } from 'crypto';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentsService } from './students.service';

@ApiTags('Students')
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  async create(@Body() createStudentDto: CreateStudentDto) {
    try {
      const data = await this.studentsService.create(createStudentDto, createStudentDto.parentNumber);

      return {
        success: true,
        data,
        message: 'Student Created Successfully'
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
      const data = await this.studentsService.findAll();

      return {
        success: true,
        data,
        message: 'Student Fetched Successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message
      };
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: UUID) {
    try {
      const data = await this.studentsService.findOne(id);

      return {
        success: true,
        data,
        message: 'Student Fetched Successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message
      };
    }
  }

  @ApiOkResponse({ description: 'The student has been successfully updated.' })
  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: UUID, @Body() updateStudentDto: UpdateStudentDto) {
    try {
      const data = await this.studentsService.update(id, updateStudentDto, updateStudentDto.parentNumber);
      return {
        success: true,
        data,
        message: 'Student Updated Successfully'
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
  @ApiOkResponse({ description: 'The student has been successfully deleted.' })
  async remove(@Param('id', ParseUUIDPipe) id: UUID) {
    try {
      await this.studentsService.remove(id);
      return {
        success: true,
        message: 'Student Deleted Successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }
}
