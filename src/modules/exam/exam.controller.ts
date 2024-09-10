import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  ParseUUIDPipe,
  Post,
  Body,
  Patch,
  Delete
} from '@nestjs/common';
import { LoggingInterceptor } from 'src/interceptors/logging.interceptor';
import { UUID } from 'crypto';
import { ApiTags } from '@nestjs/swagger';
import { ExamService } from './exam.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';

@ApiTags('Exams')
@Controller('exams')
@UseInterceptors(LoggingInterceptor)
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Post()
  async create(@Body() createExamDto: CreateExamDto) {
    try {
      const data = await this.examService.create(createExamDto);

      return {
        success: true,
        data,
        message: 'Exam Created Successfully'
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
      const data = await this.examService.findAll();
      return {
        success: true,
        data,
        message: 'Exam Fetched Successfully'
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
  async findOne(@Param('id', new ParseUUIDPipe()) id: UUID) {
    try {
      const data = await this.examService.findOne(id);
      return {
        success: true,
        data,
        message: 'Exam Fetched Successfully'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message
      };
    }
  }

  @Patch(':id')
  async update(@Param('id', new ParseUUIDPipe()) id: UUID, @Body() updateExamDto: UpdateExamDto) {
    try {
      const data = await this.examService.update(id, updateExamDto);
      return {
        success: true,
        data,
        message: 'Exam Updated Successfully'
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
  async remove(@Param('id', new ParseUUIDPipe()) id: UUID) {
    try {
      const data = await this.examService.remove(id);
      return {
        success: true,
        data,
        message: 'Exam Deleted Successfully'
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
