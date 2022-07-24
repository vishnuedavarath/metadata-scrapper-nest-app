import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AppRepository } from './app.repository';
import { ScrapeUrlDTO } from './dtos/scrape-url.dto';
import { ScrappedMetadataEntity } from './entities/scrapped-metadata.entity';
import { DynamoDBHelper } from './helpers/dynamodb.helper';
import { ScrapperService } from './scrapper/scrapper.service';

/**
 *
 * Represents the app service for metadata scrapper
 *
 **/

@Injectable()
export class AppService {
  constructor(
    private scrapperService: ScrapperService,
    private appRepository: AppRepository,
    private dynamodbHelper: DynamoDBHelper,
  ) {}

  /**
   * Returns metadata of the website from cache if record is present in cache or scrapes website for metadata
   *
   *
   * @param params - The request payload of type ScrapeUrlDTO
   * @returns scrapped metadata
   *
   *
   **/

  async scrapeUrl(params: ScrapeUrlDTO): Promise<ScrappedMetadataEntity> {
    try {
      console.debug({
        marker: 'START',
        operation: 'scrapeUrl',
        payload: {
          url: params.url,
        },
      });

      // Get cached record if present
      const cache = await this.appRepository.getCacheEntry(
        this.dynamodbHelper.getDBParams(params.url, 'siteUrl'),
      );
      if (cache) {
        console.debug({
          marker: 'END',
          operation: 'scrapeUrl',
          payload: {
            url: params.url,
            metadadta: cache.metadata,
          },
        });
        return cache.metadata;
      }
      throw new NotFoundException(
        'Entry for this request is not present in cache',
      );
    } catch (err) {
      console.warn({
        message: err.message,
      });
      try {
        // Scrape metadata if cache is not present
        const metadata = await this.scrapperService.scrapeUrl(params.url);
        console.debug({
          marker: 'END',
          operation: 'scrapeUrl',
          payload: {
            url: params.url,
            metadadta: metadata,
          },
        });
        return metadata;
      } catch (err) {
        console.error({
          message: err.message,
          error: err.name,
          errorStack: err.stack,
        });
        throw new InternalServerErrorException(err);
      }
    }
  }
}
