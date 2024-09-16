import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { Teacher } from './teacher.entity';
import { Option } from './option.entity';
import { Category } from './category.entity';
import { ExamQuestion } from './exam-question.entity';
import { QuestionType } from './enums/question-type.enum';
import { string } from 'joi';

@Entity('questions')
export class Question extends BaseEntity {
  @Column({
    type: 'enum',
    enum: QuestionType,
    default: QuestionType.SINGLE_CHOICE
  })
  public type: string;

  @Column({
    type: 'varchar',
    nullable: false
  })
  public content: string;

  @Column({
    type: 'uuid'
  })
  public categoryId: string;

  @Column({
    type: 'uuid'
  })
  public teacherId: string;

  @ManyToOne(() => Teacher, (teacher) => teacher.questions)
  public teacher: Teacher;

  @OneToMany(() => Option, (option) => option.question)
  public options: Option[];

  @ManyToOne(() => Category, (category) => category.questions)
  public category: Category;

  @OneToMany(() => ExamQuestion, (examQuestion) => examQuestion.question)
  examQuestion: ExamQuestion[];
}
