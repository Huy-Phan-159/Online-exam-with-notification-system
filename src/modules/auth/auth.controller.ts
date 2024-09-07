import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Role } from 'src/entities/enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {

    const response = await this.authService.login(loginDto);

    if (response.status !== 200) {
      return {
        statusCode: response.status,
        message: response.message,
      };
    }

    return {
      statusCode: 200,
      data: response.data,
      message: response.message,
    };
  }
}
