import { Module } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppRepository } from './app.repository';
import { AppService } from './app.service';
import { AllExceptionsFilter } from './exceptions/global-handler.exceptions';
import { DynamoDBHelper } from './helpers/dynamodb.helper';
import { ScrapperService } from './scrapper/scrapper.service';
import { ValidationPipe } from './validators/validation.pipe';

/**
 * Main Module
 *
 * @decorator `@Module`
 *
 **/

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    ScrapperService,
    DynamoDBHelper,
    AppRepository,
    // Global Exception Handler
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    // Validation Pipe
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
