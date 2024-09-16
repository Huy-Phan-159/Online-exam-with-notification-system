import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'mail of user',
    example: '@gmail.com'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
