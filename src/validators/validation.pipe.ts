/* eslint-disable @typescript-eslint/ban-types */
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    console.info({
      message: 'Starting DTO Validation',
      marker: 'START',
      operation: 'ValidationPipe::transform',
    });
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      if (errors[0].property && errors[0].constraints)
        console.error({
          message: 'Validation of dto failed',
          error: errors[0].property,
          errorStack: errors[0].constraints,
        });

      console.error({
        message: 'Validation Failed',
        error: 'BadRequestException',
      });

      throw new BadRequestException(
        `Validation failed : Invalid format of ${errors[0].property} or property not present,`,
      );
    }
    console.info({
      message: 'Starting DTO Validation',
      marker: 'END',
      operation: 'ValidationPipe::transform',
    });
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
