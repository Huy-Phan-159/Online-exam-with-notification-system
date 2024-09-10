import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

export class CreateTeacherDto extends CreateUserDto {
  @IsString()
  @MaxLength(255)
  @ApiProperty({
    description: 'Subject of teacher',
    example: 'Physical'
  })
  subject: string;
}
