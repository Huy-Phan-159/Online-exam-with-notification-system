import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fullName: string;

    @Column({ unique: true })
    email: string;

    // Add a new column to force a schema change
    @Column({ nullable: true })
    phoneNumber?: string;

    @Column({ nullable: true })
    street?: string;
}
