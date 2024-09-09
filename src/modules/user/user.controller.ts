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
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UUID } from 'crypto';
import { LoggingInterceptor } from 'src/interceptors/logging.interceptor';
import { CreateStudentDto } from './dto/create-student.dto';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';

@Controller('users')
@ApiTags('User')
@ApiTags('User')
@UseInterceptors(LoggingInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({ description: 'Get all users successfully' })
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

  @Get('teacher')
  @ApiOkResponse({ description: 'Get all teachers successfully' })
  async findAllTeacher() {
    try {
      const data = await this.userService.findAllTeacher();
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
  @ApiOkResponse({ description: 'Get user by id successfully' })
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

  @Get('teacher/:id')
  @ApiOkResponse({ description: 'Get teacher by id successfully' })
  async findTeacher(@Param('id', new ParseUUIDPipe()) id: UUID) {
    try {
      const data = await this.userService.findOneTeacher(id);
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

  @Post('student')
  @ApiCreatedResponse({ description: 'The student has been successfully created.' })
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

  @Post('teacher')
  @ApiCreatedResponse({ description: 'The teacher has been successfully created.' })
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

  @ApiCreatedResponse({ description: 'The student has been successfully updated.' })
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
  @ApiOkResponse({ description: 'The user has been successfully deleted.' })
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

  @Delete('teacher/:id')
  @ApiCreatedResponse({ description: 'The teacher has been successfully deleted.' })
  async removeTeacher(@Param('id', new ParseUUIDPipe()) id: UUID) {
    try {
      await this.userService.removeTeacher(id);
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

  @Delete('student/:id')
  @ApiCreatedResponse({ description: 'The student has been successfully deleted.' })
  async removeStudent(@Param('id', new ParseUUIDPipe()) id: UUID) {
    try {
      await this.userService.removeStudent(id);
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
