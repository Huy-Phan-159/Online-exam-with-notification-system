import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; 
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalException } from './exceptions/global.exception';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { LoggingMiddleware } from './middlewares/logging.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { ClassesModule } from './modules/classes/classes.module';
import { ExamsModule } from './modules/exams/exams.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { UsersModule } from './modules/users/users.module';
import { ApiConfigService } from './shared/services/api-config.service';
import { SharedModule } from './shared/shared.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { StudentsModule } from './modules/students/students.module';
import { OptionsModule } from './modules/options/options.module';
import { ResultsModule } from './modules/results/results.module';
import { FilesModule } from './modules/files/files.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'development' ? '.env.dev' : '.env',
      cache: true,
      expandVariables: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) => configService.postgresConfig,
      inject: [ApiConfigService]
    }),
    UsersModule,
    AuthModule,
    QuestionsModule,
    ClassesModule,
    ExamsModule,
    TeachersModule,
    StudentsModule,
    CategoriesModule,
    ClassesModule,
    OptionsModule,
    ResultsModule,
    FilesModule
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    {
      provide: APP_FILTER,
      useClass: GlobalException
    }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
