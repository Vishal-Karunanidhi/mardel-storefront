import { Meta, MediaImage, LinkWithLabel } from './shared';

// Below are all of the types that are coming back from the GraphQL layer

export type HeaderContent = {
  __typename: 'HeaderContent';
  _meta: Meta;
  contents: HeaderContentBlock[];
};

export type HeaderContentBlock =
  | PlaceholderContent
  | LinkContent
  | NotificationBarSlot
  | ComposedHeader;

type ComposedHeader = {
  __typename: 'ComposedHeader';
  logoNavigator: LogoNavigator;
  checkoutHeader: CheckoutHeader;
  theme: string;
  _meta: Meta;
};

type LogoNavigator = {
  Navigator: LinkWithLabel;
  logo: MediaImage;
  __typename: string;
};

type CheckoutHeader = {
  checkoutLabel: string;
  checkoutSteps: string[];
  returnToCart: LinkWithLabel;
  __typename: string;
};

type PlaceholderContent = {
  __typename: 'PlaceholderContent';
  _meta: Meta;
  placeholder_type: string;
};

type LinkContent = {
  __typename: 'LinkContent';
  _meta: Meta;
  theme: string;
  title: string;
};

type NotificationBarSlot = {
  __typename: 'NotificationBarSlot';
  _meta: Meta;
  slotContent: NotificationBar;
};

export type NotificationBar = {
  __typename: 'NotificationBar';
  notifications: NotificationBarSlide[];
  rotationDelay: number;
};

export type NotificationBarSlide = {
  __typename: 'NotificationBarSlide';
  title: string;
  link: NotificationLink;
};

type NotificationLink = {
  __typename: 'NotificationLink';
  openInNewTab: boolean;
  value: string;
};

export type HeaderContentBlockData =
  | PlaceholderContentData
  | LinkContentData
  | NotificationBarSlotData
  | ComposedHeaderData;

type ComposedHeaderData = ComposedHeader & {
  key: 'ComposedHeader';
};

type PlaceholderContentData = PlaceholderContent & {
  key: 'PlaceholderContent';
};

type LinkContentData = LinkContent & {
  key: '';
};

export type NotificationBarSlotData = NotificationBarSlot & {
  notifications: NotificationBarSlide[];
  key: 'NotificationBarSlot';
};
