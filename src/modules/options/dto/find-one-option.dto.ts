import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class FindOneOptionDTO {
  @ApiProperty({
    description: 'uuid of option'
  })
  @IsUUID(4)
  optionId: UUID;
}
