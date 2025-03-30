import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { FeedsModule } from './feeds/feeds.module';
import { DynamoDBModule } from './common/dynamoDB/dynamodb.module';

@Module({
  imports: [DynamoDBModule, CommonModule, FeedsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
