import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UUID } from 'crypto';
import { User } from 'src/entities/user.entity';
import { UpdateResult } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentsService } from './students.service';
import { Role } from 'src/entities/enums/role.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';

@Roles(Role.ADMIN, Role.TEACHER)
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('Students')
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  async create(@Body() createStudentDto: CreateStudentDto): Promise<User> {
    return await this.studentsService.create(createStudentDto, createStudentDto.parentNumber);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return await this.studentsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: UUID): Promise<User> {
    return await this.studentsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateStudentDto: UpdateStudentDto
  ): Promise<UpdateResult> {
    return await this.studentsService.update(id, updateStudentDto, updateStudentDto.parentNumber);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'The student has been successfully deleted.' })
  async remove(@Param('id', ParseUUIDPipe) id: UUID): Promise<UpdateResult> {
    return await await this.studentsService.remove(id);
  }
}
