import { Column, Entity, Index, OneToOne } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { Gender } from './enums/gender.enum';
import { Role } from './enums/role.enum';
import { Student } from './student.entity';
import { Teacher } from './teacher.entity';

@Entity('users')
@Index(['firstName', 'lastName'])
export class User extends BaseEntity {
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.TEACHER
  })
  role: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 100,
    unique: true
  })
  email: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  password: string;

  @Column({
    type: 'date',
    nullable: false
  })
  birthDate: Date;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.MALE
  })
  gender: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 15
  })
  phoneNumber: string;

  @Column({
    type: 'boolean',
    default: false
  })
  isActive: boolean;

  @Column({
    type: 'varchar',
    nullable: false
  })
  firstName: string;

  @Column({
    type: 'varchar',
    nullable: false
  })
  lastName: string;

  @OneToOne(() => Teacher)
  teacher: Teacher

  @OneToOne(() => Student)
  student: Student
}
