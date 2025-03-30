import { Inject, Injectable } from '@nestjs/common';
import { CreateFeedDto } from './dto/create-feed.dto';
// import { UpdateFeedDto } from './dto/update-feed.dto';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { DYNAMODB_TABLE_NAME } from 'src/common/dynamoDB/dynamoDB.const';
import { v4 as uuidv4 } from 'uuid';
import { QueryCommand } from '@aws-sdk/client-dynamodb';

@Injectable()
export class FeedsService {
  constructor(
    @Inject('DYNAMODB_CLIENT')
    private readonly dynamoDBClient: DynamoDBDocumentClient,
  ) {}

  async create(createFeedDto: CreateFeedDto) {
    console.log(createFeedDto);
    const feedId = uuidv4();

    const command = new PutCommand({
      TableName: DYNAMODB_TABLE_NAME,
      Item: {
        PK: `feed#${feedId}`,
        SK: `feed#${feedId}`,
        Title: createFeedDto.title,
        Description: createFeedDto.description ?? null,
      },
    });

    const res = await this.dynamoDBClient.send(command);
    return res;
  }

  async findAll() {
    const command = new QueryCommand({
      TableName: DYNAMODB_TABLE_NAME,
      IndexName: 'GSI_ENTITY_PK-createdAt-index', // 최신순 정렬 GSI
      KeyConditionExpression: 'GSI_ENTITY_PK = :pk',
      ExpressionAttributeValues: {
        ':pk': { S: 'feed' },
      },
      ScanIndexForward: false, // 최신순 정렬
      Limit: 10,
    });

    const { Items } = await this.dynamoDBClient.send(command);
    return Items;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} feed`;
  // }
  //
  // update(id: number, updateFeedDto: UpdateFeedDto) {
  //   return `This action updates a #${id} feed`;
  // }
  //
  // remove(id: number) {
  //   return `This action removes a #${id} feed`;
  // }
}
