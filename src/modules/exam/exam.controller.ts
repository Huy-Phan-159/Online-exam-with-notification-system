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
import { MessageResponse } from 'src/decorators/message-response.decorator';

@ApiTags('Exams')
@Controller('exams')
@UseInterceptors(LoggingInterceptor)
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Post()
  @MessageResponse('Create Exam Successfully')
  async create(@Body() createExamDto: CreateExamDto) {
    const data = await this.examService.create(createExamDto);
    return data;
  }

  @Get()
  @MessageResponse('Get Exams Successfully')
  async findAll() {
    const data = await this.examService.findAll();
    return data;
  }

  @Get(':id')
  @MessageResponse('Get Exam Successfully')
  async findOne(@Param('id', new ParseUUIDPipe()) id: UUID) {
    const data = await this.examService.findOne(id);
    return data;
  }

  @Patch(':id')
  @MessageResponse('Update Exam Successfully')
  async update(@Param('id', new ParseUUIDPipe()) id: UUID, @Body() updateExamDto: UpdateExamDto) {
    const data = await this.examService.update(id, updateExamDto);
    return data;
  }

  @Delete(':id')
  @MessageResponse('Delete Exam Successfully')
  async remove(@Param('id', new ParseUUIDPipe()) id: UUID) {
    const data = await this.examService.remove(id);
    return data;
  }
}
