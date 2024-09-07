import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString, MaxLength } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class CreateStudentDto extends CreateUserDto {
  @IsString()
  @IsPhoneNumber()
  @MaxLength(15)
  @ApiProperty({
    description: 'phone number of parent',
    example: '+8494865913'
  })
  parentNumber: string;
}
