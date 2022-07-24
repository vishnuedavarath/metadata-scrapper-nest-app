import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ddbClient } from './client/dynamodb.client';
import { MetadataCacheEntity } from './entities/metadata-cache.entity';

@Injectable()
export class AppRepository {
  async createCacheEntry(params): Promise<void> {
    try {
      console.log(params);
      await ddbClient.send(new PutCommand(params));
    } catch (err) {
      throw new InternalServerErrorException(
        'Error occurred while creating cache entry!',
        err,
      );
    }
  }

  async getCacheEntry(params): Promise<MetadataCacheEntity> {
    try {
      console.log(params);
      const result = await ddbClient.send(new GetCommand(params));
      return result.Item as MetadataCacheEntity;
    } catch (err) {
      throw new InternalServerErrorException(
        'Error occurred while retieving cache',
        err,
      );
    }
  }
}
