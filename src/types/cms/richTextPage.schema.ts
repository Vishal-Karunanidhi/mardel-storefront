import { Meta } from '@Types/shared';
import { ContentPageBreadcrumb } from './schema/contentPage.schema';

export type RichTextPageContent = {
  richText: string;
  breadcrumbs: ContentPageBreadcrumb;
  meta: Meta;
};
