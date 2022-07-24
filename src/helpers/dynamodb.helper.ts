import { Injectable } from '@nestjs/common';
import { MetadataCacheEntity } from 'src/entities/metadata-cache.entity';

/**
 *
 * Represents the class containing helper functions fro dynamoDB operations
 *
 **/

@Injectable()
export class DynamoDBHelper {
  createDBParams(cache: MetadataCacheEntity, KEY: string) {
    return {
      TableName: process.env.CACHE_TABLE,
      Item: cache,
      ConditionExpression: KEY + ' <> :m',
      ExpressionAttributeValues: {
        ':m': cache[KEY],
      },
    };
  }

  getDBParams(url: string, KEY: string) {
    return {
      TableName: process.env.CACHE_TABLE,
      Key: { [KEY]: url },
    };
  }
}
