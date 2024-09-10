import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength } from "class-validator";
import { UpdateUserDto } from "src/modules/users/dto/update-user.dto";

export class UpdateTeacherDto extends UpdateUserDto {
  @IsString()
  @MaxLength(255)
  @ApiProperty({
    description: 'Subject of teacher',
    example: 'Physical'
  })
  subject: string;
}
