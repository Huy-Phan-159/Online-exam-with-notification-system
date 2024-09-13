import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/decorators/get-user.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/entities/enums/role.enum';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { CreateQuestionDto } from './dto/create-question.dto';
import { FindOneQuestionDTO } from './dto/find-one-question.dto';
import { Paginate } from './dto/paginate.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionsService } from './questions.service';

@Roles(Role.TEACHER)
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
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
  update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
    return this.questionsService.update(+id, updateQuestionDto);
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
