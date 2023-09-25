import { CtaWithLabel } from '@Types/homepage';
import { LinkWithLabel, Meta, MediaImage } from '@Types/shared';

export type ContentMainSection = {
  _meta: Meta;
  title: string;
  richText: string;
  __typename: 'ContentMainSection';
};

export type ContentPageBreadcrumb = {
  _meta?: Meta;
  links: LinkWithLabel[];
  __typename?: 'ContentPageBreadcrumb';
};

export type ContentRichText = {
  _meta: Meta;
  richText: string;
  __typename: 'ContentRichText';
};

export type ContentPageImage = {
  _meta: Meta;
  ContentImage: MediaImage;
  __typename: 'ContentPageImage';
};

export type ContentCTA = {
  _meta: Meta;
  cta: CtaWithLabel;
  title: string;
  body: string;
  __typename: 'ContentCTA';
};

export type OrganizationCardComponent = {
  _meta: Meta;
  image: MediaImage;
  description: string;
  details: string;
  altimagetext: string;
};

export type RecalledProduct = {
  _meta: Meta;
  productImage: MediaImage;
  productText: string;
  openNewTab: boolean;
};

export type RecallYear = {
  _meta: Meta;
  recalledProducts: RecalledProduct[];
  year: number;
};

export type PdfUrl = {
  openInNewTab: boolean;
  url: string;
};

export type HolidayMessagesCard = {
  _meta: Meta;
  holidayMessagesImage: MediaImage;
  holidayMessagesPdf: PdfUrl;
  occasion: string;
  title: string;
  year: number;
  altText: string;
};

export type OrganizationList = {
  __typename: 'OrganizationList';
  _meta: Meta;
  organizations: OrganizationCardComponent[];
  header: string;
};

export type RecallProductsAndYears = {
  __typename: 'RecallProductsAndYears';
  _meta: Meta;
  recallList: RecallYear[];
};

export type HolidayMessagesCardList = {
  __typename: 'HolidayMessagesCardList';
  _meta: Meta;
  title: string;
  cardList: HolidayMessagesCard[];
};

export type ContentComponent =
  | ContentMainSection
  | ContentPageBreadcrumb
  | ContentRichText
  | ContentCTA
  | ContentPageImage
  | OrganizationList
  | RecallProductsAndYears
  | HolidayMessagesCardList;

export type ContentPage = {
  _meta: Meta;
  content: ContentComponent[];
};
