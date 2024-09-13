import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UUID } from 'crypto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/entities/enums/role.enum';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { LoggingInterceptor } from 'src/interceptors/logging.interceptor';
import { CreateExamDto } from './dto/create-exam.dto';
import { ExamQueryDto } from './dto/query-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { ExamsService } from './exams.service';

@Roles(Role.TEACHER)
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
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
