import { Meta, Media } from '@Types/shared';
import { ContentPageBreadcrumb } from './schema/contentPage.schema';

export type TemplateCardBody = {
  invitationUrl: string;
  rsvpUrl: string;
  sku: string;
  templateImage: Media;
  templateName: string;
  templateUrl: string;
};

export type TemplateCard = {
  groupTitle: string;
  templateCardBody: [TemplateCardBody];
};

export type TemplatePageBody = {
  templateCard: [TemplateCard];
};

export type WeddingTemplatesContent = {
  templatePageBody: TemplatePageBody;
  breadcrumbs: ContentPageBreadcrumb;
  _meta: Meta;
};
