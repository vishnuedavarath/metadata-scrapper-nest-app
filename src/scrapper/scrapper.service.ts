import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { AppRepository } from '../app.repository';
import { DynamoDBHelper } from '../helpers/dynamodb.helper';
import { ScrappedMetadataEntity } from '../entities/scrapped-metadata.entity';

/**
 *
 * Represents the scrapper service for metadata scrapper
 *
 **/

@Injectable()
export class ScrapperService {
  constructor(
    private appRepository: AppRepository,
    private dynamodbHelper: DynamoDBHelper,
  ) {}

  /**
   * Returns metadata of the website by scrapping the webpage source
   *
   *
   * @param params - The request payload of type ScrapeUrlDTO
   * @returns scrapped metadata
   *
   *
   **/

  async scrapeUrl(url: string): Promise<ScrappedMetadataEntity> {
    try {
      console.debug({
        marker: 'START',
        operation: 'scrapperService::scrapeUrl',
        payload: {
          url: url,
        },
      });

      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
      const ogMetadata = await this.ogScrapper($);
      const responseObject: ScrappedMetadataEntity = {
        title: ogMetadata.title || $('head title').text(),
        description:
          ogMetadata.description ||
          $('meta[name="description"]').attr('content'),
        ...ogMetadata,
      };

      const $images = $('img');

      if ($images && $images.length) {
        for (let i = 0; i < $images.length; i++) {
          responseObject.image.push($($images[i]).attr('src'));
        }
      }
      try {
        await this.appRepository.createCacheEntry(
          this.dynamodbHelper.createDBParams(
            {
              siteUrl: url,
              metadata: responseObject,
              ttl: Date.now() + 1800000,
            },
            'siteUrl',
          ),
        );
      } catch (err) {
        console.error(err);
      }

      console.debug({
        marker: 'END',
        operation: 'scrapperService::scrapeUrl',
        payload: {
          metadata: responseObject,
        },
      });
      //send the response
      return responseObject;
    } catch (err) {
      console.error({
        message: err.message,
        error: err.name,
        errorStack: err.stack,
      });
      throw new InternalServerErrorException(err);
    }
  }
  /**
   * Returns metadata of the website by scrapping the webpage source
   *
   *
   * @param $ - Cheerio selecter
   * @returns scrapped open graph metadata
   *
   *
   **/

  private async ogScrapper($): Promise<ScrappedMetadataEntity> {
    console.debug({
      marker: 'START',
      operation: 'scrapperService::ogScrapper',
    });
    const meta = $('meta');
    const keys = Object.keys(meta);
    const result: ScrappedMetadataEntity = {
      title: '',
      description: '',
      image: [],
    };

    // Find and extract all open graph metadata tags
    keys.forEach(function (key) {
      if (
        meta[key].attribs &&
        meta[key].attribs.property &&
        meta[key].attribs.property.indexOf('og') == 0
      ) {
        const og = meta[key].attribs.property.split(':');
        // Store all og metadata with it's property name and skip strucutred properties
        if (og.length === 2) {
          if (result[og[1]]) {
            if (result[og[1]] instanceof Array) {
              result[og[1]].push(meta[key].attribs.content);
            } else {
              result[og[1]] = result[og[1]];
              result[og[1]].push(meta[key].attribs.content);
            }
          } else {
            result[og[1]] = meta[key].attribs.content;
          }
        }
      }
    });
    console.debug({
      marker: 'START',
      operation: 'scrapperService::ogScrapper',
      payload: {
        metadata: result,
      },
    });
    return result;
  }
}
