import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString, MaxLength } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class CreateStudentDto extends CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  @MaxLength(15)
  @ApiProperty({
    description: 'phone number of parent',
    example: '+442071234567'
  })
  parentNumber: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'role of student',
    example: 'student'
  })
  role: string;
}
