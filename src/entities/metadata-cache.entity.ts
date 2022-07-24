import { ScrappedMetadataEntity } from './scrapped-metadata.entity';

/**
 *
 * Represents the class for metadata cache entity
 *
 **/

export class MetadataCacheEntity {
  siteUrl: string;
  metadata: ScrappedMetadataEntity;
  ttl: number;
}
