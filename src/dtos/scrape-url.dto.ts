import { IsDefined, IsUrl } from 'class-validator';

/**
 *
 * Represents the DTO for ScrapeUrl Payload
 *
 **/

export class ScrapeUrlDTO {
  @IsDefined()
  @IsUrl()
  url: string;
}
