import { Module } from '@nestjs/common';
import { DynamoDBModule } from './dynamoDB/dynamodb.module';

@Module({
  imports: [DynamoDBModule],
  exports: [DynamoDBModule],
})
export class CommonModule {}
