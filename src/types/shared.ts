type Meta = {
  name: string;
  schema: string;
  deliveryId: string;
  deliveryKey: string;
};

type openGraphImage = {
  url: string;
};

type MetaData = {
  keywords: string;
  title: string;
  description: string;
  ogImage: openGraphImage;
};

type UNKNOWN = {
  _meta: Meta;
};

type MediaImage = {
  _meta: Meta;
  defaultHost: string;
  endpoint: string;
  id: string;
  name: string;
  url: string;
};

type Logo = {
  _meta: Meta;
  image: MediaImage;
  altText: string;
};

type LinkWithLabel = {
  label: string;
  value: string;
  openInNewTab: Boolean;
};

type Media = {
  image: MediaImage;
  imageAltText: string;
};

export type { Meta, UNKNOWN, MediaImage, Logo, LinkWithLabel, Media, MetaData };
