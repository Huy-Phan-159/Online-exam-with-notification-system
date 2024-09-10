import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { Result } from './result.entity';
import { StudentClass } from './student-class.entity';
import { User } from './user.entity';

@Entity('students')
export class Student extends BaseEntity {
  @Column({
    type: 'varchar',
    nullable: true,
    length: 15
  })
  public parentNumber: string;

  @OneToOne(() => User, (user) => user.student, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'id'
  })
  public user: User;

  @OneToMany(() => Result, (result) => result.student)
  public results: Result[];

  @OneToMany(() => StudentClass, (studentClass) => studentClass.class)
  public studentClass: StudentClass[];
}
