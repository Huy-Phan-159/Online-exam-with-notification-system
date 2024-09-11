import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateClassDto } from './create-class.dto';

export class QueryClassDto extends CreateClassDto {
  @ApiProperty({ required: false, default: 1 })
  @IsNumber()
  @Type(() => Number)
  readonly page: number;

  @ApiProperty({ required: false, default: 10 })
  @IsNumber()
  @Type(() => Number)
  readonly limit: number;
}
