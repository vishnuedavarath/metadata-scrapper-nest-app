import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Response } from 'express';
import { ExceptionConstants } from './constants.exception';
/*
 * Represents the global exception class.
 *
 * @remarks
 * Implements ExceptionFilter
 * All the handled and unhandled exception will come here.
 *
 *
 */
@Injectable()
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private errorLogger;

  /**
   * Catches an excpetion.
   *
   * @param exception - of type HttpException
   * @param host - of type ArgumentsHost
   *
   */

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception.message || ExceptionConstants.GENERIC_ERROR;
    const error = exception.name || ExceptionConstants.GENERIC_ERROR;

    const responseObject = {
      statusCode: status,
      message: message,
      error: error,
    };

    // send response
    response.status(status).json(responseObject);
  }
}
