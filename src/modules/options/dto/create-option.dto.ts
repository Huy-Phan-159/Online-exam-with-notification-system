import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsString } from 'class-validator';
import { UUID } from 'crypto';
export class CreateOptionDto {
  @ApiProperty({
    description: 'Content of option',
    example: 'option'
  })
  @Expose()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Option is correcrt ',
    example: 'false'
  })
  @Expose()
  @IsBoolean()
  isCorrect: boolean;

  @ApiProperty({
    description: 'uuid of question'
  })
  @Expose()
  @IsString()
  questionId: UUID;
}
