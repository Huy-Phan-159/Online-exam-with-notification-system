import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, ILike, Repository } from 'typeorm';
import { ERRORS_DICTIONARY } from 'src/constraints/error-dictionary.constraint';
import { UUID } from 'crypto';
import { Exam } from 'src/entities/exam.entity';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Teacher } from 'src/entities/teacher.entity';

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(Exam)
    private examRepository: Repository<Exam>,
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>
  ) {}

  async create(createExamDto: CreateExamDto, userId: UUID): Promise<Exam> {
    const existingExam = await this.examRepository.findOne({ where: { name: createExamDto.name } });
    if (existingExam) {
      throw new BadRequestException(ERRORS_DICTIONARY.EXAM_NAME_EXIST);
    }
    const teacher = await this.teacherRepository.findOne({ where: { user: { id: userId } } });

    const newExam = this.examRepository.create({
      ...createExamDto,
      teacher: { id: teacher.id },
      category: { id: createExamDto.categoryId }
    });
    return await this.examRepository.save(newExam);
  }

  async findAll(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ data: Exam[]; totalPages: number; currentPage: number }> {
    const whereClause = search ? [{ name: ILike(`%${search}%`) }, { description: ILike(`%${search}%`) }] : {};

    const [data, totalItems] = await this.examRepository.findAndCount({
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
    const examData = await this.examRepository.findOneBy({ id });
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
    const examData = this.examRepository.merge(existingExam, updateExamDto);
    return await this.examRepository.save(examData);
  }

  async remove(id: UUID): Promise<DeleteResult> {
    const exam = await this.examRepository.findOneBy({ id });
    if (!exam) {
      throw new BadRequestException(ERRORS_DICTIONARY.EXAM_NOT_FOUND);
    }
    return await this.examRepository.softDelete({ id });
  }
}
