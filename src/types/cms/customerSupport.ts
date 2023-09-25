import { Media, Meta } from '@Types/shared';
import { ContentCTA, ContentPageBreadcrumb } from './schema/contentPage.schema';

type CustomerSupportPageContent = ContentCTA | Card;

export type Card = {
  _meta: Meta;
  title: String;
  link: String;
  media: Media;
  __typename: 'Card';
};

type CustomerSupportPage = {
  breadcrumbs: ContentPageBreadcrumb;
  content: CustomerSupportPageContent[];
};

export type { CustomerSupportPage };
