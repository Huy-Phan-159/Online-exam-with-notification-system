import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class CreateResultDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'time start',
    example: '2024-09-13 9:00:00'
  })
  timeStart: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Id Student',
    example: ''
  })
  studentId: UUID;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Id Exam',
    example: ''
  })
  examId: UUID;
}
