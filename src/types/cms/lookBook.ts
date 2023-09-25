import { HeroSlotContent, Promos } from '@Types/homepage';
import { Meta } from '@Types/shared';
import { ContentCTA } from './schema/contentPage.schema';

type LookBookPage = {
  _meta: Meta;
  content: LookBookPageContent;
  __typename: 'LookBookPage';
};

type LookBookPageContent = (HeroSlotContent | TwoTileComponent | Promos)[];

type TwoTileComponent = {
  tileSlots: (Promos | ContentCTA)[];
  __typename: 'TwoTileComponent';
};

export type { LookBookPage, LookBookPageContent };
