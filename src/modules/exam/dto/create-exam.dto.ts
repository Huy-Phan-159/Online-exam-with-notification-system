import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';
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

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Id category',
    example: ''
  })
  categoryId: UUID;
}
