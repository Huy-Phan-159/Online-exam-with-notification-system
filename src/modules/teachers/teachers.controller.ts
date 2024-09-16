import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UUID } from 'crypto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/entities/enums/role.enum';
import { User } from 'src/entities/user.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { LoggingInterceptor } from 'src/interceptors/logging.interceptor';
import { UpdateResult } from 'typeorm';
import { UserPaginationDto } from '../users/dto/user-pagination.dto';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { TeachersService } from './teachers.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
@Controller('teacher')
@ApiTags('Teacher')
@UseInterceptors(LoggingInterceptor)
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  @ApiCreatedResponse({ description: 'The teacher has been successfully created.' })
  async create(@Body() createTeacherDto: CreateTeacherDto): Promise<User> {
    return await this.teachersService.create(createTeacherDto, createTeacherDto.subject);
  }

  @Get()
  @ApiOkResponse({ description: 'Get all teachers successfully' })
  async findAll(@Query() userPagination: UserPaginationDto) {
    return await this.teachersService.findAll(userPagination);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Get teacher by id successfully' })
  async findOne(@Param('id', ParseUUIDPipe) id: UUID): Promise<User> {
    return await this.teachersService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'The teacher has been successfully updated.' })
  async update(
    @Param('id', ParseUUIDPipe) id: UUID,
    @Body() updateTeacherDto: UpdateTeacherDto
  ): Promise<UpdateResult> {
    return await this.teachersService.update(id, updateTeacherDto, updateTeacherDto.subject);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Deleted teacher successfully' })
  async remove(@Param('id', ParseUUIDPipe) id: UUID): Promise<UpdateResult> {
    return await this.teachersService.remove(id);
  }
}
