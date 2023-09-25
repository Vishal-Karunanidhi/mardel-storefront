import { CtaWithLabel } from '@Types/homepage';
import { MediaImage } from '@Types/shared';
import { ContentPageBreadcrumb } from './schema/contentPage.schema';

type ContactUsRequestKeys = keyof ContactUsRequest;

type ContactUsRequest = {
  comments?: string;
  customerEmail: string;
  damagedSku?: string;
  emailAddress?: string;
  firstName: string;
  lastName: string;
  line1?: string;
  line2?: string;
  missingSku?: string;
  orderNumber?: string;
  phoneNumber?: string;
  reason: string;
  sku?: string;
  state?: string;
  storeNumber?: string;
  storeLocation?: string;
  townCity?: string;
  zipCode?: string;
  wrongSku?: string;
};

type ContactUsResponse = {
  contactUs: {
    Status: number;
    Message: string;
  };
};

type ContactUsPage = {
  breadcrumbs: ContentPageBreadcrumb;
  pageDescription: PageDescription;
  topicSelection: TopicSelection;
};

type PageDescription = {
  pageDescriptionText: string;
  pageDescriptionLink: CtaWithLabel;
};

type TopicSelection = {
  description: string;
  dropdownLabel: string;
  warningSection: WarningSection;
};

type WarningSection = {
  warningIcon: MediaImage;
  warningDisclaimer: string;
};

export type {
  ContactUsRequestKeys,
  ContactUsRequest,
  ContactUsResponse,
  ContactUsPage,
  PageDescription,
  TopicSelection
};
