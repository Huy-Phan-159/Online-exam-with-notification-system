import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from 'src/entities/class.entity';
import { StudentClass } from 'src/entities/student-class.entity';
import { ClassesRepository } from './classes.repository';
import { UsersModule } from '../users/users.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Class, StudentClass]), UsersModule],
  controllers: [ClassesController],
  providers: [ClassesService, ClassesRepository, JwtService]
})
export class ClassesModule {}
