import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { Exam } from './exam.entity';
import { Question } from './question.entity';
import { User } from './user.entity';

@Entity('teachers')
export class Teacher extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true
  })
  subject: string;

  @OneToOne(() => User, (user) => user.teacher, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @OneToMany(() => Exam, (exam) => exam.teacher)
  exams: Exam[];

  @OneToMany(() => Question, (question) => question.teacher)
  questions: Question[];
}
