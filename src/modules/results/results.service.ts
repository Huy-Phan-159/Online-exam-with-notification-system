import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, ILike, Repository, UpdateResult } from 'typeorm';
import { ERRORS_DICTIONARY } from 'src/constraints/error-dictionary.constraint';
import { UUID } from 'crypto';
import { Result } from 'src/entities/Result.entity';
import { CreateResultDto } from './dto/create-result.dto';
import { Option } from 'src/entities/option.entity';
import { ExamsService } from '../exams/exams.service';
import { SubmitResultDto } from './dto/submit-result.dto';
import { HistoryAnswer } from 'src/entities/history-answer.entity';
import { QuestionType } from 'src/entities/enums/question-type.enum';

@Injectable()
export class ResultsService {
  constructor(
    @InjectRepository(Result)
    private resultsRepository: Repository<Result>,
    @InjectRepository(HistoryAnswer)
    private historyAnswersRepository: Repository<HistoryAnswer>,
    private examsService: ExamsService
  ) {}

  async create(createResultDto: CreateResultDto): Promise<Result> {
    const { examId, studentId } = createResultDto;
    const result = this.resultsRepository.create({
      ...createResultDto,
      exam: { id: examId },
      student: { id: studentId }
    });
    return await this.resultsRepository.save(result);
  }
  async findAll(
    page?: number,
    limit?: number,
    search?: string
  ): Promise<{ data: Result[]; totalPages: number; currentPage: number } | Result[]> {
    if (!page && !limit) return await this.resultsRepository.find();
    const whereClause = search ? [{ name: ILike(`%${search}%`) }, { description: ILike(`%${search}%`) }] : {};

    const [data, totalItems] = await this.resultsRepository.findAndCount({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit
    });
    const totalPages = Math.ceil(totalItems / limit);

    return {
      data,
      totalPages,
      currentPage: page
    };
  }

  async findOne(id: UUID): Promise<Result> {
    return await this.findResultExist(id);
  }

  async remove(id: UUID): Promise<DeleteResult> {
    await this.findResultExist(id);
    return await this.resultsRepository.softDelete({ id });
  }

  async submit(id: UUID, submitResultDto: SubmitResultDto): Promise<UpdateResult> {
    const result = await this.findResultExist(id);
    const { optionIds, timeTaken } = submitResultDto;
    optionIds.forEach(async (option) => {
      const newHistoryAnswer = this.historyAnswersRepository.create({
        result: { id },
        option: { id: option }
      });
      await this.historyAnswersRepository.save(newHistoryAnswer);
    });
    let countCorrectAnswer = 0;
    const questions = await this.examsService.getQuestionsInExam(result.exam.id);
    const options = await this.findAnwersOfResult(id);
    questions.map((question) => {
      const questionOptions = options.filter((option) => option.question.id === question.id);
      if (question.type === QuestionType.SINGLE_CHOICE) {
        const hasCorrectAnswer = questionOptions.some((option) => option.isCorrect);
        if (hasCorrectAnswer) {
          countCorrectAnswer += 1;
        }
      }
      if (question.type === QuestionType.MULTIPLE_CHOICES) {
        const totalAnswersCorrect = question.options.filter((option) => option.isCorrect === true);
        const allChooseCorrects = questionOptions.every((option) => option.isCorrect);
        if (allChooseCorrects && questionOptions.length === totalAnswersCorrect.length) {
          countCorrectAnswer += 1;
        }
      }
    });
    const score = countCorrectAnswer / questions.length;
    return await this.resultsRepository.update(id, { score: score, timeTaken: timeTaken });
  }

  async findAnwersOfResult(id: UUID): Promise<Option[]> {
    const result = await this.resultsRepository.findOne({
      where: { id },
      relations: ['historyAnswer', 'historyAnswer.option']
    });
    const options = result.historyAnswers.map((historyAnswer) => historyAnswer.option);
    return options;
  }

  async findResultExist(id: UUID): Promise<Result> {
    const resultData = await this.resultsRepository.findOneBy({ id });
    if (!resultData) {
      throw new BadRequestException(ERRORS_DICTIONARY.RESULT_NOT_FOUND);
    }
    return resultData;
  }
}
