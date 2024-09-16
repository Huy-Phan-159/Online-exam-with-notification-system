import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class SubmitResultDto {
  @IsArray()
  @IsUUID()
  @IsOptional()
  @ApiProperty()
  optionIds: UUID[];

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'time do Exam',
    example: '45 minutes'
  })
  timeTaken: string;
}
