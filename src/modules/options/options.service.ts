import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { Option } from 'src/entities/option.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UUID } from 'crypto';
import { QuestionsService } from '../questions/questions.service';
import { ERRORS_DICTIONARY } from 'src/constraints/error-dictionary.constraint';
import { QuestionType } from 'src/entities/enums/question-type.enum';
import { UsersService } from '../users/users.service';
import { User } from 'src/entities/user.entity';

@Injectable()
export class OptionsService {
  constructor(
    @InjectRepository(Option) private optionRepository: Repository<Option>,
    private userService: UsersService,
    private questionService: QuestionsService
  ) {}
  async create(user: any, dto: CreateOptionDto) {
    await this.userService.findOne(user.id);
    const { content, isCorrect, questionId } = dto;
    const options = await this.getAllOptionByQuestionId(questionId);
    const { type } = await this.questionService.getOneOrExist(questionId);
    var optionIns: Option = null;

    if (type === QuestionType.SINGLE_CHOICE) {
      //check question is
      const hasOptionCorrect = options.some((option) => option.isCorrect);
      if (!hasOptionCorrect) {
        optionIns = this.optionRepository.create({
          content: content,
          isCorrect: isCorrect,
          question: {
            id: questionId
          }
        });
      } else {
        if (isCorrect === false) {
          optionIns = this.optionRepository.create({
            content: content,
            isCorrect: isCorrect,
            question: {
              id: questionId
            }
          });
        } else {
          throw new BadRequestException({
            message: ERRORS_DICTIONARY.CREATE_OPTION_FAIL
          });
        }
      }
    }

    if (type === QuestionType.MULTIPLE_CHOICES) {
      optionIns = this.optionRepository.create({
        content: content,
        isCorrect: isCorrect,
        question: {
          id: questionId
        }
      });
    }

    const newOption = await this.optionRepository.save(optionIns);
    if (!newOption) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.CREATE_OPTION_FAIL
      });
    }
    return newOption;
  }

  async findOneOrThrow(optionId: UUID) {
    const foundOption = await this.optionRepository.findOne({
      where: {
        id: optionId
      }
    });
    if (!foundOption) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.OPTION_NOT_FOUND
      });
    }
    return foundOption;
  }

  async update(id: UUID, user: User, updateOptionDto: UpdateOptionDto) {
    const teacherId = user.teacher.id;

    const updateOption = await this.optionRepository.findOne({
      where: {
        id,
        question: {
          teacher: {
            id: teacherId
          }
        }
      }
    });

    if (!updateOption) {
      throw new BadRequestException({
        message: ERRORS_DICTIONARY.OPTION_NOT_FOUND
      });
    }

    await this.optionRepository.update(updateOption.id, updateOptionDto).then((updateResult) => {
      if (!updateResult.affected) {
        throw new BadRequestException({
          message: ERRORS_DICTIONARY.NOT_RECORD_WAS_UPDATED
        });
      }

      return true;
    });
  }

  async remove(optionId: UUID) {
    await this.findOneOrThrow(optionId);
    return await this.optionRepository.softDelete(optionId);
  }

  async getAllOptionByQuestionId(questionId: UUID) {
    try {
      const options = await this.optionRepository
        .createQueryBuilder('o')
        .where('o.questionId = :id', { id: questionId })
        .getMany();
      return options;
    } catch (error) {
      throw new Error(error);
    }
  }
}
