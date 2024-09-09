import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString, MaxLength } from 'class-validator';

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
    example: '+442071234567'
  })
  phoneNumber: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'birthDate time using ISO8601',
    example: '2023-04-15'
  })
  birthDate: Date;

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
