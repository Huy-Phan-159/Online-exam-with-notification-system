import { Entity, Column, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from './base/base.entity';
import { Question } from './question.entity';
import { Exam } from './exam.entity';

@Entity('teachers')
export class Teacher extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true
  })
  subject: string;

  @OneToOne(() => User)
  @JoinColumn({
    name: 'userId'
  })
  user: User;

  @OneToMany(() => Exam, (exam) => exam.teacher)
  exams: Exam[];

  @OneToMany(() => Question, (question) => question.teacher)
  questions: Question[];
}
