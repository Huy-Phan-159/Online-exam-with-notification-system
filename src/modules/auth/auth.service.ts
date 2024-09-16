import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserNotFoundException } from 'src/exceptions/users/userNotFound.excetion';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { MailService } from 'src/shared/services/mail.service';
import { MailDTO } from 'src/shared/interfaces/mail.dto';
import { ResetPasswordTemplate } from 'src/shared/template/reset-password.template';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOneByEmail(loginDto.email);

    if (!user) {
      throw new UserNotFoundException();
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new BadRequestException('The email or password is incorrect.');
    }

    const payload = { userId: user.id, role: user.role };

    const token = this.jwtService.sign(payload);

    return token;
  }

  async forgotPassword(userEmail: string) {
    const foundUser = await this.usersService.findOneByEmail(userEmail);
    const payload = {
      userId: foundUser.id
    };
    const token = this.jwtService.sign(payload);
    const resetLink = `${process.env.LINK_APP}?token=${token}`;
    const newTemplate = new ResetPasswordTemplate(resetLink);
    const dto: MailDTO = {
      from: 'Auth-backend service',
      to: userEmail,
      subject: 'Password reset',
      html: newTemplate.getTemplate()
    };
    await this.mailService.sendMail(dto);
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET_KEY });
      const password = await bcrypt.hash(newPassword, 10);
      return await this.usersService.updatePassword(password, payload.userId);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
