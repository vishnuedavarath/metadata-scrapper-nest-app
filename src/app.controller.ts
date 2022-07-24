import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';
import { ScrapeUrlDTO } from './dtos/scrape-url.dto';
import { ScrappedMetadataEntity } from './entities/scrapped-metadata.entity';

/**
 * Represents the app controller for metadata scrapper
 *
 **/

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * Returns metadata of the website with the requested url
   *
   * @decorator `@Post`
   * @decorator `@Body`
   * @decorator `@Req`
   *
   * @param body - The request payload of type ScrapeUrlDTO
   * @returns scrapped metadata
   *
   * @throws BadRequestException
   * This exception is thrown if body is not passing validation criteria defined for ScrapeUrlDTO
   *
   **/

  @Post('/scrape')
  async scrapUrl(
    @Body() body: ScrapeUrlDTO,
    @Req() req: Request,
  ): Promise<ScrappedMetadataEntity> {
    console.info({
      marker: 'START',
      operation: `${req.method} ${req.path}`,
    });
    const metadata = await this.appService.scrapeUrl(body);

    console.info({
      marker: 'END',
      operation: `${req.method} ${req.path}`,
    });

    return metadata;
  }
}
