import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class FindOneQuestionDTO {
  @ApiProperty({
    description: 'uuid of question'
  })
  @IsUUID(4)
  questionId: UUID;
}
