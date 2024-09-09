import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class CreateTeacherDto extends CreateUserDto {
  @IsString()
  @MaxLength(255)
  @ApiProperty({
    description: 'Subject of teacher',
    example: 'Physical'
  })
  subject: string;
}
