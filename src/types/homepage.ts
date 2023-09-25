import { FooterTypeCompiled } from './cms/compiled/footer.compiled';
import { HeaderContentBlockData } from './header';
import { MegaNavChildren } from './cms/raw/megaNav.raw';
import { MegaNavMobileType } from './cms/megaNavMobile';
import { Meta, Media } from './shared';
import { GtmDataLayer } from 'src/interfaces/gtmDataLayer';

// The following types are used within the components themselves

export type HomePageIndexProps = {
  homePageMetaData: MetaData;
  gtmData: GtmDataLayer;
  homePageCmsData: PageBlockData[];
};

// TODO change types from any
export type LayoutIndexProps = {
  children?: JSX.Element | JSX.Element[];
  megaNavData: MegaNavChildren[];
  megaNavMobileData: MegaNavMobileType;
  globalHeaderCmsData: HeaderContentBlockData[];
  globalFooterCmsData: FooterTypeCompiled;
  lineItemCount?: number;
  recentlyViewedKeys?: string[];
};

// Below are all of the types that are coming back from the GraphQL layer

export type Page = {
  __typename: 'Page';
  _meta: Meta;
  content: PageBlock[];
};

export type PageBlock =
  | HeroSlot
  | CardList
  | FreeShippingContent
  | WhatsOnSaleContent
  | VideoComponent;

type HeroSlot = {
  __typename: 'HeroSlot';
  _meta: Meta;
  slotContent: HeroSlotContent;
};

export type HeroSlotContent = {
  __typename: 'HeroSlotContent';
  _meta: Meta;
  description: string;
  heading1: string;
  heading2: string;
  heading3: string;
  image: Image;
  link: BannerLink;
};

type Image = {
  __typename: 'Image';
  defaultHost: string;
  endpoint: string;
  id: string;
  name: string;
  URL: string;
};

export type CtaWithLabel = {
  __typename: string;
  label: string;
  value: string;
};

type Video = {
  __typename: 'Video';
  _meta: Meta;
  image: MediaImage;
  altimagetext: string;
  videotitle: string;
  videolink: string;
};

type BannerLink = {
  __typename: 'BannerLink';
  label: string;
  value: string;
};

type CardList = {
  __typename: 'CardList';
  _meta: Meta;
  Cards: Card[];
  theme: string;
  Title: string;
  numberToCardsToShowOnDesktop?: number;
  numberToCardsToShowOnMobile?: number;
};

type Card = {
  __typename: 'Card';
  _meta: Meta;
  cardImage: CardImage;
  cardName: string;
  URL: string;
};

type CardImage = {
  __typename: 'CardImage';
  cardName: string;
  imageAltText: string;
  seoText: string;
};

type FreeShippingContent = {
  __typename: 'FreeShippingContent';
  _meta: Meta;
  image: Image;
  policies: string;
  subtitle: string;
  title: string;
};

type VideoComponent = {
  __typename: 'VideoComponent';
  _meta: Meta;
  cta: CtaWithLabel;
  description: string;
  video: Video;
};

export type WhatsOnSaleLink = {
  title: string;
  url: string;
};

export type WhatsOnSaleContent = {
  __typename: 'WhatsOnSaleContent';
  _meta: Meta;
  heading: string;
  link: WhatsOnSaleLink[];
};

type SecondaryPromoComponent = {
  __typename: 'SecondaryPromoComponent';
  _meta: Meta;
  Promos: Promos[];
  Title: string;
};

export type Promos = {
  _meta: Meta;
  link: string;
  media: Media;
  discountLabel: string;
  description: string;
  style: React.CSSProperties;
  imgStyle: React.CSSProperties;
  showCartBagIcon: boolean;
  showShareIcon: boolean;
  __typename: 'PromoCard';
};

export type Link = {
  __typename: 'Link';
  content: LinkContent;
};

export type LinkContent = {
  __typename: 'LinkContent';
  _meta: Meta;
  theme: string;
  title: string;
};

export type ProductSelector = {
  _typename: 'ProductSelector';
  _meta: Meta;
  label: string;
  products: string[];
};

export type PageBlockData =
  | HeroSlotContentData
  | CardListData
  | FreeShippingContentData
  | VideoComponentData
  | WhatsOnSaleContentData
  | SecondaryPromoComponentData
  | ProductSelectorData;

export type MetaData = {
  keywords: string;
  title: string;
  description: string;
  ogImageUrl: string;
};

export type PageData = {
  pageMetaData: MetaData;
  pageBlockData: PageBlockData[];
};

export type HeroSlotContentData = HeroSlotContent & {
  key: 'HeroSlot';
};

export type ProductSelectorData = ProductSelector & {
  key: 'ProductSelector';
};

export type CardListData = CardList & {
  key: 'Departments' | 'ShopByCategory' | 'Seasons';
};

export type FreeShippingContentData = FreeShippingContent & {
  key: 'FreeShippingContent';
};

export type VideoComponentData = VideoComponent & {
  key: 'VideoComponent';
};

export type WhatsOnSaleContentData = WhatsOnSaleContent & {
  key: 'WhatsOnSaleContent';
};

export type SecondaryPromoComponentData = SecondaryPromoComponent & {
  key: 'SecondaryPromoComponent';
};
