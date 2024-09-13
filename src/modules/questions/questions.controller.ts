import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
  UseInterceptors,
  UseGuards,
  ParseUUIDPipe
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { UUID } from 'crypto';
import { ApiTags } from '@nestjs/swagger';
import { Paginate } from './dto/paginate.dto';
import { FindOneQuestionDTO } from './dto/find-one-question.dto';
import { TransformInterceptor } from 'src/interceptors/transform-responce.interceptor';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { User } from 'src/decorators/get-user.decorator';

@ApiTags('Questions')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@User() user, @Body() createQuestionDto: CreateQuestionDto) {
    return await this.questionsService.create(user, createQuestionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':questionId')
  async findOne(@Param() dto: FindOneQuestionDTO) {
    return await this.questionsService.findOne(dto.questionId);
  }

  @Patch(':id')
  async update(@Param('id', new ParseUUIDPipe()) id: UUID, @Body() updateQuestionDto: UpdateQuestionDto) {
    return await this.questionsService.update(id, updateQuestionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':questionId')
  async remove(@Param() dto: FindOneQuestionDTO) {
    return await this.questionsService.remove(dto.questionId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  async getAllQuestion(@User() user, @Query() dto: Paginate) {
    const data = await this.questionsService.getAllQuestions(user, dto);
    return data;
  }
}
