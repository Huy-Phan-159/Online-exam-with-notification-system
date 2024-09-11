import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

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
}
