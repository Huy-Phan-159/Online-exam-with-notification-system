import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseInterceptors
} from '@nestjs/common';
import { UUID } from 'crypto';
import { LoggingInterceptor } from 'src/interceptors/logging.interceptor';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { CreateStudentDto } from './dto/create-student.dto';

@Controller('users')
@ApiTags('User')
@UseInterceptors(LoggingInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('student')
  async createStudent(@Body() createStudentDto: CreateStudentDto) {
    try {
      await this.userService.createStudent(createStudentDto, createStudentDto.parentNumber);

      return {
        success: true,
        message: 'Student Created Successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  @Post('student')
  async createTeacher(@Body() createTeacherDto: CreateTeacherDto) {
    try {
      await this.userService.createTeacher(createTeacherDto, createTeacherDto.subject);

      return {
        success: true,
        message: 'Teacher Created Successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  @Get()
  async findAll() {
    try {
      const data = await this.userService.findAll();
      return {
        success: true,
        data,
        message: 'User Fetched Successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: UUID) {
    try {
      const data = await this.userService.findOne(id);
      return {
        success: true,
        data,
        message: 'User Fetched Successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  @Patch(':id')
  async update(@Param('id', new ParseUUIDPipe()) id: UUID, @Body() updateUserDto: UpdateUserDto) {
    try {
      await this.userService.updateUser(id, updateUserDto);
      return {
        success: true,
        message: 'User Updated Successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  @Delete(':id')
  async remove(@Param('id', new ParseUUIDPipe()) id: UUID) {
    try {
      await this.userService.removeUser(id);
      return {
        success: true,
        message: 'User Deleted Successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }
}
