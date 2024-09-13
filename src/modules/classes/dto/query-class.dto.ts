import { IsDateString, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateClassDto } from './create-class.dto';

export class QueryClassDto {
  @ApiProperty({ required: false, default: 1 })
  @IsNumber()
  @Type(() => Number)
  readonly page: number;

  @ApiProperty({ required: false, default: 10 })
  @IsNumber()
  @Type(() => Number)
  readonly limit: number;

  @IsString()
  @ApiProperty({ required: false })
  readonly name: string = '';
}
