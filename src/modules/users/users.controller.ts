import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UUID } from 'crypto';
import { LoggingInterceptor } from 'src/interceptors/logging.interceptor';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('Users')
@UseInterceptors(LoggingInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({ description: 'Get all users successfully' })
  async findAll() {
    const data = await this.usersService.findAll();
    return data;
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Get user by id successfully' })
  async findOne(@Param('id', ParseUUIDPipe) id: UUID) {
    const data = await this.usersService.findOne(id);
    return data;
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'The student has been successfully updated.' })
  async update(@Param('id', ParseUUIDPipe) id: UUID, @Body() updateUserDto: UpdateUserDto) {
    const data = await this.usersService.updateUser(id, updateUserDto);
    return data;
  }
}
