import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, ILike, Repository, UpdateResult } from 'typeorm';
import { ERRORS_DICTIONARY } from 'src/constraints/error-dictionary.constraint';
import { UUID } from 'crypto';
import { Exam } from 'src/entities/exam.entity';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { UsersRepository } from '../users/users.repository';
import { ExamQuestion } from 'src/entities/exam-question.entity';
import { QuestionsService } from '../questions/questions.service';
import { Question } from 'src/entities/question.entity';
import { ExamClass } from 'src/entities/exam-class.entity';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(Exam)
    private examsRepository: Repository<Exam>,
    private usersRepository: UsersRepository,
    @InjectRepository(ExamQuestion)
    private examQuestionsRepository: Repository<ExamQuestion>,
    @InjectRepository(ExamClass)
    private examClassRepository: Repository<ExamClass>,
    private questionsService: QuestionsService
  ) {}

  async create(createExamDto: CreateExamDto, userId: UUID): Promise<Exam> {
    const { name, categoryId, numberOfQuestions, classIds, timeStart, timeEnd } = createExamDto;

    const existingExam = await this.examsRepository.findOne({ where: { name: name } });
    if (existingExam) {
      throw new BadRequestException(ERRORS_DICTIONARY.EXAM_NAME_EXIST);
    }
    const teacher = (await this.usersRepository.findOneTeacher(userId)).teacher;

    const newExam = this.examsRepository.create({
      ...createExamDto,
      teacher: { id: teacher.id },
      category: { id: categoryId }
    });
    await this.examsRepository.save(newExam);

    // Create exam_class
    classIds.forEach(async (classId) => {
      const newExamClass = this.examClassRepository.create({
        exam: { id: newExam.id },
        class: { id: classId },
        timeStart: new Date(timeStart),
        timeEnd: new Date(timeEnd)
      });
      await this.examClassRepository.save(newExamClass);
    });

    // Create exam_question
    const questions = await this.questionsService.findQuestionByCategory(categoryId);
    for (let i = questions.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[randomIndex]] = [questions[randomIndex], questions[i]];
    }

    const selectedQuestions = questions.slice(0, numberOfQuestions);

    selectedQuestions.forEach(async (question, index) => {
      const newExamQuestion = this.examQuestionsRepository.create({
        order: index + 1,
        exam: { id: newExam.id },
        question: { id: question.id }
      });
      await this.examQuestionsRepository.save(newExamQuestion);
    });

    return newExam;
  }

  async findAll(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ data: Exam[]; totalPages: number; currentPage: number }> {
    const whereClause = search ? [{ name: ILike(`%${search}%`) }, { description: ILike(`%${search}%`) }] : {};

    const [data, totalItems] = await this.examsRepository.findAndCount({
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

  async findOne(id: UUID, relations?: string[]): Promise<Exam> {
    const examData = await this.examsRepository.findOne({
      where: { id },
      relations: relations
    });
    if (!examData) {
      throw new BadRequestException(ERRORS_DICTIONARY.EXAM_NOT_FOUND);
    }
    return examData;
  }

  async update(id: UUID, updateExamDto: UpdateExamDto): Promise<UpdateResult> {
    await this.findOne(id);
    return await this.examsRepository.update(id, updateExamDto);
  }

  async remove(id: UUID): Promise<DeleteResult> {
    const exam = await this.findOne(id, ['examQuestion', 'examClass']);
    await Promise.all(
      exam.examQuestion.map(async (examToQuestion) => {
        await this.examQuestionsRepository.delete(examToQuestion.id);
      })
    );
    await Promise.all(
      exam.examClass.map(async (examClass) => {
        await this.examClassRepository.delete(examClass.id);
      })
    );
    return await this.examsRepository.delete({ id });
  }

  async getQuestionsInExam(id: UUID): Promise<Question[]> {
    const exam = await this.examsRepository.findOne({
      where: { id },
      relations: ['examQuestion', 'examQuestion.question'],
      order: {
        examQuestion: {
          order: 'ASC'
        }
      }
    });
    if (!exam) {
      throw new BadRequestException(ERRORS_DICTIONARY.EXAM_NOT_FOUND);
    }
    const questions = exam.examQuestion.map((examQuestion) => examQuestion.question);
    return questions;
  }
}
