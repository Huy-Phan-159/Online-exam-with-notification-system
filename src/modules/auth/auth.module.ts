import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { ApiConfigService } from 'src/shared/services/api-config.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),

    JwtModule.registerAsync({
      useFactory: (configService: ApiConfigService) => ({
        secret: configService.getString('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '15d' }
      }),
      inject: [ApiConfigService]
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
