import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @IsEmail()
  @ApiProperty({
    description: 'email of user',
    example: 'admin@gmail.com'
  })
  email: string;

  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    description: 'password of user',
    example: 'admin'
  })
  password: string;
}
