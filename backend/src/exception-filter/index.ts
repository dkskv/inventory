import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { ApolloError } from 'apollo-server-express';
import { Response } from 'express';

@Catch()
export class GqlExceptionFilter implements GqlExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (
      exception instanceof UnauthorizedException ||
      exception instanceof ApolloError
    ) {
      return exception;
    }

    if (exception instanceof HttpException) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();

      const status = exception.getStatus();

      response.status(status).json({
        statusCode: status,
        message:
          status === HttpStatus.NOT_FOUND
            ? // Скрытие внутреннего пути до ресурса
              'Resource not found'
            : exception.message,
      });
    }

    return new ApolloError('Internal Server Error');
  }
}
