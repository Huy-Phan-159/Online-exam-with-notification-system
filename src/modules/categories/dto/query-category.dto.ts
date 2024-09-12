import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class QueryCategoryDto {
  @ApiProperty({ required: false, default: 1 })
  @IsNumber()
  @Type(() => Number)
  readonly page: number = 1;

  @ApiProperty({ required: false, default: 10 })
  @IsNumber()
  @Type(() => Number)
  readonly limit: number = 10;

  @IsString()
  @ApiProperty({ required: false })
  readonly name: string = '';
}
