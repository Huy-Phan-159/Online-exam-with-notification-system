import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPhoneNumber, IsString, MaxLength } from 'class-validator';
import { UpdateUserDto } from 'src/modules/users/dto/update-user.dto';

export class UpdateStudentDto extends UpdateUserDto {
  @IsString()
  @IsOptional()
  @IsPhoneNumber()
  @MaxLength(15)
  @ApiProperty({
    description: 'phone number of parent',
    example: '+442071234567'
  })
  parentNumber: string;
}
