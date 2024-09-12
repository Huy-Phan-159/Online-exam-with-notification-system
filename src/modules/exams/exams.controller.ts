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
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { ExamQueryDto } from './dto/query-exam.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@ApiBearerAuth()
@ApiTags('Exams')
@Controller('exams')
@UseInterceptors(LoggingInterceptor)
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createExamDto: CreateExamDto, @Req() req: Request) {
    const userId = req['user'].id;
    return await this.examsService.create(createExamDto, userId);
  }

  @Get()
  async findAll(@Query() query: ExamQueryDto) {
    const { page, limit, search } = query;
    return await this.examsService.findAll(page, limit, search);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: UUID) {
    return await this.examsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id', new ParseUUIDPipe()) id: UUID, @Body() updateExamDto: UpdateExamDto) {
    return await this.examsService.update(id, updateExamDto);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe()) id: UUID) {
    return await this.examsService.remove(id);
  }
}
