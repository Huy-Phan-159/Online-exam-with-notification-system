import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from 'src/entities/question.entity';
import { Repository } from 'typeorm';
import { Option } from 'src/entities/option.entity';
import { Teacher } from 'src/entities/teacher.entity'; // Import the Teacher entity
import { UUID } from 'crypto';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(Option)
    private readonly optionRepository: Repository<Option>,
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>
  ) {}

  async createFromCsv(csvData: any[], category: string, user: UUID): Promise<any> {
    const userId = user;
    const groupedResults = this.groupData(csvData);
    const transformedData = this.transformData(groupedResults);
    const categoryId = category;

    const teacher = await this.teacherRepository.findOne({ where: { user: { id: userId } } });

    for (const item of transformedData) {
      const question = new Question();
      question.content = item.content;
      question.categoryId = categoryId;
      question.type = item.type;
      question.teacher = teacher;

      const savedQuestion = await this.questionRepository.save(question);

      const options = item.options.map((opt) => {
        const option = new Option();
        option.content = opt.option;
        option.isCorrect = opt.isCorrect;
        option.question = savedQuestion;

        return option;
      });

      await this.optionRepository.save(options);
    }

    return true;
  }

  private groupData(data): any[] {
    const grouped = [];
    let currentGroup = [];
    data.forEach((item) => {
      if (item.content) {
        if (currentGroup.length > 0) {
          grouped.push(currentGroup);
          currentGroup = [];
        }
      }
      currentGroup.push(item);
    });
    if (currentGroup.length > 0) {
      grouped.push(currentGroup);
    }
    return grouped;
  }

  private transformData(groupedData): any[] {
    return groupedData.map((group) => {
      const content = group[0].content;
      const options = group.map((item) => ({
        option: item.options,
        isCorrect: item.isCorrect === 'TRUE'
      }));

      return { content, options };
    });
  }
}
