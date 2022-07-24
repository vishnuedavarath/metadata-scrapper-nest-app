import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { Server } from 'http';
import { AppModule } from './app.module';
import { createServer, proxy } from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';
import { Handler } from 'express-serve-static-core';
import { Context } from 'vm';

const binaryMimeTyps: string[] = [];
let cachedServer: Server;

/**
 * Bootstraps the application
 *
 **/

async function bootstrapServer(): Promise<Server> {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );

    nestApp.use(eventContext());
    await nestApp.init();
    cachedServer = createServer(expressApp, undefined, binaryMimeTyps);
  }
  return cachedServer;
}

/**
 * AWS Lambda Handler
 *
 **/

export const handler: Handler = async (event: any, context: Context) => {
  cachedServer = await bootstrapServer();
  return proxy(cachedServer, event, context, 'PROMISE').promise;
};
