import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { UUID } from 'crypto';
import { Exam } from 'src/entities/exam.entity';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';

@Injectable()
export class ExamService {
  constructor(
    @InjectRepository(Exam)
    private examRepository: Repository<Exam>
  ) {}

  async create(createExamDto: CreateExamDto): Promise<Exam> {
    try {
      const existingExam = await this.examRepository.findOne({ where: { name: createExamDto.name } });
      if (existingExam) {
        throw new ConflictException('An exam with this name already exists.');
      }
      const newExam = this.examRepository.create({
        ...createExamDto,
        teacher: { id: createExamDto.teacherId },
        category: { id: createExamDto.categoryId }
      });
      return await this.examRepository.save(newExam);
    } catch (error) {
      throw error;
    }
  }
  async findAll(): Promise<Exam[]> {
    return await this.examRepository.find();
  }

  async findOne(id: UUID): Promise<Exam> {
    const examData = await this.examRepository.findOneBy({ id });
    if (!examData) {
      throw new BadRequestException({
        message: 'Exam not found'
      });
    }
    return examData;
  }

  async update(id: UUID, updateExamDto: UpdateExamDto): Promise<Exam> {
    const existingExam = await this.findOne(id);
    if (!existingExam) {
      throw new BadRequestException({
        message: 'Exam not found'
      });
    }
    const examData = this.examRepository.merge(existingExam, updateExamDto);
    return await this.examRepository.save(examData);
  }

  async remove(id: UUID): Promise<DeleteResult> {
    const exam = await this.examRepository.findOneBy({ id });
    if (!exam) {
      throw new BadRequestException({
        message: 'Exam not found'
      });
    }
    return await this.examRepository.softDelete({ id });
  }
}
