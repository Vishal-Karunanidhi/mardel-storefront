import { Meta, MetaData } from '@Types/shared';
import { Card } from '@Types/cms/customerSupport';
import { ContentCTA, ContentPageBreadcrumb } from './schema/contentPage.schema';

export type RelatedQuestions = {
  openInNewTab: boolean;
  __typename: 'RelatedQuestions';
};

export type Questions = {
  answer: string;
  question: string;
  relatedQuestions: [RelatedQuestions];
  __typename: 'Questions';
};

export type Topics = {
  topicName: string;
  questions: [Questions];
  __typename: 'Topics';
};

export type FaqPage = {
  meta: Meta;
  breadcrumbs: ContentPageBreadcrumb;
  metaData: MetaData;
  ctaPanel: ContentCTA;
  topics: Topics[];
  header: Card[];
  questions: Questions[];
  relatedQuestions: RelatedQuestions[];
};
