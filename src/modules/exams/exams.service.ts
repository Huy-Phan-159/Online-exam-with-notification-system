import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, ILike, Repository } from 'typeorm';
import { ERRORS_DICTIONARY } from 'src/constraints/error-dictionary.constraint';
import { UUID } from 'crypto';
import { Exam } from 'src/entities/exam.entity';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(Exam)
    private examsRepository: Repository<Exam>,
    private usersRepository: UsersRepository
  ) {}

  async create(createExamDto: CreateExamDto, userId: UUID): Promise<Exam> {
    const existingExam = await this.examsRepository.findOne({ where: { name: createExamDto.name } });
    if (existingExam) {
      throw new BadRequestException(ERRORS_DICTIONARY.EXAM_NAME_EXIST);
    }
    const teacher = (await this.usersRepository.findOneTeacher(userId)).teacher;

    const newExam = this.examsRepository.create({
      ...createExamDto,
      teacher: { id: teacher.id },
      category: { id: createExamDto.categoryId }
    });
    return await this.examsRepository.save(newExam);
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

  async findOne(id: UUID): Promise<Exam> {
    const examData = await this.examsRepository.findOneBy({ id });
    if (!examData) {
      throw new BadRequestException(ERRORS_DICTIONARY.EXAM_NOT_FOUND);
    }
    return examData;
  }

  async update(id: UUID, updateExamDto: UpdateExamDto): Promise<Exam> {
    const existingExam = await this.findOne(id);
    if (!existingExam) {
      throw new BadRequestException(ERRORS_DICTIONARY.EXAM_NOT_FOUND);
    }
    const examData = this.examsRepository.merge(existingExam, updateExamDto);
    return await this.examsRepository.save(examData);
  }

  async remove(id: UUID): Promise<DeleteResult> {
    const exam = await this.examsRepository.findOneBy({ id });
    if (!exam) {
      throw new BadRequestException(ERRORS_DICTIONARY.EXAM_NOT_FOUND);
    }
    return await this.examsRepository.softDelete({ id });
  }
}
