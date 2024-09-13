import { UUID } from 'crypto';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exam } from './exam.entity';
import { Class } from './class.entity';
import { BaseEntity } from './base/base.entity';

@Entity('exams_classes')
export class ExamClass extends BaseEntity {
  @Column({
    type: 'uuid'
  })
  public examId: UUID;

  @Column({
    type: 'uuid'
  })
  public classId: UUID;

  @ManyToOne(() => Exam, (exam) => exam.examClass)
  public exam: Exam;

  @ManyToOne(() => Class, (studentClass) => studentClass.examClass)
  public class: Class;

  @Column({
    type: 'timestamp',
    nullable: false
  })
  public timeStart: Date;

  @Column({
    type: 'timestamp',
    nullable: false
  })
  public timeEnd: Date;
}
