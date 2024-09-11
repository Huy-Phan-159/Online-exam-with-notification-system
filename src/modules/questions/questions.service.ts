import { BadRequestException, ForbiddenException, Injectable, NotAcceptableException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from 'src/entities/question.entity';
import { Teacher } from 'src/entities/teacher.entity';
import { Category } from 'src/entities/category.entity';
import { UserService } from '../user/user.service';
import { UUID } from 'crypto';
import { ERRORS_DICTIONARY } from 'src/constraints/error-dictionary.constraint';
import { Paginate } from './dto/paginate.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question) private questionRepository: Repository<Question>,
    private userService: UserService
  ) {}

  async create(user: any, createQuestionDto: CreateQuestionDto): Promise<Question> {
    const { id } = await this.userService.findOneTeacherByUserId(user.userId);
    const { categoryId, content, type } = createQuestionDto;
    const question = this.questionRepository.create({
      content: content,
      type: type,
      category: {
        id: categoryId
      },
      teacher: {
        id: id
      }
    });

    const newQuestion = await this.questionRepository.save(question);
    if (!newQuestion) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.CREATE_QUESTION_FAIL
      });
    }
    return newQuestion;
  }

  findAll() {
    return `This action returns all questions`;
  }

  async getAllQuestions(user: any, dto: Paginate) {
    const limit = dto.limit;
    const offset = (dto.page - 1) * limit;
    const query = this.questionRepository.createQueryBuilder('question').limit(limit).offset(offset);

    if (!user) {
      throw new ForbiddenException({
        message:ERRORS_DICTIONARY.NOT_RIGHTS
      });
    }
    if (user.role === 'teacher') {
      const teacher = await this.userService.findOneTeacherByUserId(user.userId);
      return query
        .innerJoinAndSelect('question.teacher', 'teacher')
        .select(['question.type', 'question.content'])
        .where('teacher.id = :teacherId', { teacherId: teacher.id })
        .getMany();
    }
    if (user.role === 'admin') {
      return await query.getMany();
    }
    throw new BadRequestException({
      message: ERRORS_DICTIONARY.NOT_RIGHTS
    });
  }

  async findOne(questionId: UUID) {
    return await this.questionRepository.findOne({
      where: {
        id: questionId
      }
    });
  }

  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return `This action updates a #${id} question`;
  }

  async remove(questionId: UUID) {
    const question=await this.getOneOrExist(questionId)
    const obj = await this.questionRepository.softDelete(questionId);
    return obj;
  }
  async getOneOrExist(questionId: UUID) {
    const question = await this.questionRepository.findOne({
      where: {
        id: questionId
      }
    });
    if (!question) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.QUESTION_NOT_FOUND
      });
    }
    return question
  }
}
