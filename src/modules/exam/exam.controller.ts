import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  ParseUUIDPipe,
  Post,
  Body,
  Patch,
  Delete,
  Query,
  UseGuards,
  Req
} from '@nestjs/common';
import { LoggingInterceptor } from 'src/interceptors/logging.interceptor';
import { UUID } from 'crypto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExamService } from './exam.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { ExamQueryDto } from './dto/query-exam.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@ApiBearerAuth()
@ApiTags('Exams')
@Controller('exams')
@UseInterceptors(LoggingInterceptor)
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createExamDto: CreateExamDto, @Req() req: Request) {
    const userId = req['user'].userId;
    return await this.examService.create(createExamDto, userId);
  }

  @Get()
  async findAll(@Query() query: ExamQueryDto) {
    const { page, limit, search } = query;
    return await this.examService.findAll(page, limit, search);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: UUID) {
    return await this.examService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id', new ParseUUIDPipe()) id: UUID, @Body() updateExamDto: UpdateExamDto) {
    return await this.examService.update(id, updateExamDto);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe()) id: UUID) {
    return await this.examService.remove(id);
  }
}
