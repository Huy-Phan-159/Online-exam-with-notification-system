import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const skip = this.reflector.get<boolean>('skipGlobalInterceptor', context.getHandler());
    if (skip) return next.handle();
    const messageResponse = this.reflector.get<string>('messageResponse', context.getHandler());
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        message: messageResponse || 'success'
      }))
    );
  }
}
