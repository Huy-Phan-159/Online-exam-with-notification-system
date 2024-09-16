import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { Student } from './student.entity';
import { Exam } from './exam.entity';
import { HistoryAnswer } from './history-answer.entity';

@Entity('results')
export class Result extends BaseEntity {
  @Column({
    type: 'decimal',
    nullable: false,
    default: 0
  })
  public score: number;

  @Column({
    type: 'timestamp',
    nullable: false
  })
  public timeStart: Date;

  @Column({
    type: 'interval',
    nullable: false,
    default: 0
  })
  public timeTaken: string;

  @OneToMany(() => HistoryAnswer, (historyAnswer) => historyAnswer.result)
  public historyAnswers: HistoryAnswer[];

  @ManyToOne(() => Student, (student) => student.results)
  public student: Student;

  @ManyToOne(() => Exam, (exam) => exam.results)
  public exam: Exam;
}
