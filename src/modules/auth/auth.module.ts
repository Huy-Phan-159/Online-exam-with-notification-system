import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ApiConfigService } from 'src/shared/services/api-config.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailService } from 'src/shared/services/mail.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      useFactory: (configService: ApiConfigService) => ({
        secret: configService.getString('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '15d' }
      }),
      inject: [ApiConfigService]
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, MailService]
})
export class AuthModule {}
