import { BadRequestException, ForbiddenException, Injectable, NotAcceptableException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Question } from 'src/entities/question.entity';
import { UsersService } from '../users/users.service';
import { UUID } from 'crypto';
import { ERRORS_DICTIONARY } from 'src/constraints/error-dictionary.constraint';
import { Paginate } from './dto/paginate.dto';
import { error } from 'console';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question) private questionRepository: Repository<Question>,
    private userService: UsersService
  ) {}

  async create(user: any, createQuestionDto: CreateQuestionDto): Promise<Question> {
    const { teacher } = await this.userService.findOne(user.id);
    const { categoryId, content, type } = createQuestionDto;
    const question = this.questionRepository.create({
      content: content,
      type: type,
      category: {
        id: categoryId
      },
      teacher: {
        id: teacher.id
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

  async getAllQuestions(user: any, dto: Paginate) {
    const foundUser = await this.userService.findOne(user.id);
    const limit = dto.limit;
    const offset = (dto.page - 1) * limit;
    const query = this.questionRepository.createQueryBuilder('question').limit(limit).offset(offset);

    if (!user) {
      throw new ForbiddenException({
        message: ERRORS_DICTIONARY.NOT_RIGHTS
      });
    }
    if (foundUser.role === 'teacher') {
      // const { teacher } = await this.userService.findOne(user);
      const teacher = foundUser.teacher;
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
      },
      relations: { category: true }
    });
  }

  async update(id: UUID, updateQuestionDto: UpdateQuestionDto): Promise<Question> {
    return await this.questionRepository
      .update(id, updateQuestionDto)
      .then((updateResult) => {
        if (!updateResult.affected)
          throw new BadRequestException({
            message: ERRORS_DICTIONARY.NOT_RECORD_WAS_UPDATED
          });

        return id;
      })
      .then(async (updatedQuestionId) => {
        return await this.findOne(updatedQuestionId);
      })
      .catch((error) => {
        throw error;
      });
  }

  async remove(questionId: UUID) {
    const question = await this.getOneOrExist(questionId);
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
    return question;
  }
}
