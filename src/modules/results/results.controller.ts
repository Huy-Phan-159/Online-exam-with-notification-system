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
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { LoggingInterceptor } from 'src/interceptors/logging.interceptor';
import { ResultsService } from './results.service';
import { ResultQueryDto } from './dto/query-result.dto';
import { CreateResultDto } from './dto/create-result.dto';
import { SubmitResultDto } from './dto/submit-result.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiBearerAuth()
@ApiTags('Results')
@Controller('results')
@UseInterceptors(LoggingInterceptor)
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createResultDto: CreateResultDto, @Req() req: Request) {
    return await this.resultsService.create(createResultDto);
  }

  @Get()
  async findAll(@Query() query: ResultQueryDto) {
    const { page, limit, search } = query;
    return await this.resultsService.findAll(page, limit, search);
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: UUID) {
    return await this.resultsService.findOne(id);
  }

  @Get(':id/answer')
  async findAnwersOfResult(@Param('id', new ParseUUIDPipe()) id: UUID) {
    return await this.resultsService.findAnwersOfResult(id);
  }

  @Patch(':id/submit')
  async submit(@Param('id', new ParseUUIDPipe()) id: UUID, @Body() submitResultDto: SubmitResultDto) {
    return await this.resultsService.submit(id, submitResultDto);
  }

  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe()) id: UUID) {
    return await this.resultsService.remove(id);
  }
}
