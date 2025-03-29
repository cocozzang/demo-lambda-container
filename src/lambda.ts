import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import serverlessExpress from '@codegenie/serverless-express';
import { RequestListener } from 'node:http';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Callback,
  Context,
  Handler,
} from 'aws-lambda';

let server: Handler<APIGatewayProxyEvent, APIGatewayProxyResult>;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance() as RequestListener;
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrap());

  return server(event, context, callback);
};
