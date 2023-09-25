import { ContentMainSection } from './cms/schema/contentPage.schema';
import { HeroSlotContent } from './homepage';
import { MetaData } from './shared';

type DynamicCategoryPageConent = HeroSlotContent | ContentMainSection;

type DynamicCategoryPage = {
  content: DynamicCategoryPageConent[];
  metaData: MetaData;
};

export type { DynamicCategoryPage };
