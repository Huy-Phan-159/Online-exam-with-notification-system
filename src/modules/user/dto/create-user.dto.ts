import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsPhoneNumber, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @IsEmail()
  @ApiProperty({
    description: 'email of user',
    example: 'abc@gmail.com'
  })
  email: string;

  @ApiProperty({
    example: 'student'
  })
  @IsString()
  role?: string;

  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    description: 'password of user',
    example: '123@Abc'
  })
  password: string;

  @ApiProperty({
    example: 'F'
  })
  @IsString()
  gender: string;

  @IsPhoneNumber()
  @MaxLength(15)
  @ApiProperty({
    description: 'phone number of user',
    example: '+8494865913'
  })
  phoneNumber: string;

  @IsBoolean()
  isActive: boolean;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'First name of the user',
    example: 'John'
  })
  firstName: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'First name of the user',
    example: 'John'
  })
  lastName: string;
}
