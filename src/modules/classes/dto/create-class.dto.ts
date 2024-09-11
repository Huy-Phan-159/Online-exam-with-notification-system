import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsDateString, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;

  // Ensure the date is in the correct YYYY-MM-DD format
  @IsDateString({}, { message: 'timeStart must be a valid date in YYYY-MM-DD format' })
  @ApiProperty({ type: String, format: 'date', example: '2024-09-10' })
  readonly timeStart: Date;

  // Ensure the date is in the correct YYYY-MM-DD format
  @IsDateString({}, { message: 'timeEnd must be a valid date in YYYY-MM-DD format' })
  @ApiProperty({ type: String, format: 'date', example: '2025-09-10' })
  readonly timeEnd: Date;

  @IsArray()
  @IsUUID('all', { each: true, message: 'Each studentId must be a valid UUID' })
  @ApiProperty({
    type: [String],
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    description: 'List of student IDs'
  })
  readonly studentIds: UUID[] = [];
}
