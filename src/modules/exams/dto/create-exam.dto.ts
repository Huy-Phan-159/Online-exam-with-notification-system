import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class CreateExamDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of the exam',
    example: 'English Test'
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The description of the exam',
    example: 'English Test 45 minutes'
  })
  description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Exam time',
    example: '45 minutes'
  })
  duration: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'number question of the exam',
    example: 20
  })
  numberOfQuestions: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'time start the exam',
    example: '2024-09-13 10:00:00'
  })
  timeStart: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'time end of the exam',
    example: '2024-09-13 11:00:00'
  })
  timeEnd: string;

  @IsArray()
  @IsUUID('all', { each: true, message: 'Each classId must be a valid UUID' })
  @IsNotEmpty()
  @ApiProperty({
    description: 'Id of the classes that will receive the exam',
    example: ['d7d61bf0-6d0a-4b55-8067-183214272007', 'dfed9e21-89a4-4b78-a7a3-668cc4ec35c8']
  })
  classIds: UUID[];

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Id category',
    example: '66dbe6a8-a13c-800e-b86e-2b5bdb2faeda'
  })
  categoryId: UUID;
}
