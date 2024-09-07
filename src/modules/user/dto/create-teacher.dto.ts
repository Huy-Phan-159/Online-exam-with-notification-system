import { IsString, MaxLength } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeacherDto extends CreateUserDto {
  @IsString()
  @MaxLength(255)
  @ApiProperty({
    description: 'Subject of teacher',
    example: 'Physical'
  })
  subject: string;
}
