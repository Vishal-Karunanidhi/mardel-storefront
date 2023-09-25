import { Meta, MetaData } from '@Types/shared';
import { BreadCrumb } from '../pdp/pdpData.schema';
import { ContentPageBreadcrumb } from '../contentPage.schema';
import { InstantSearchServerState } from 'react-instantsearch-hooks-web';
import { ProductSelector } from '@Types/cms/seasonal';
import { CategoryGtmDataLayer } from 'src/interfaces/gtmDataLayer';

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

type BannerLink = {
  __typename: 'BannerLink';
  label: string;
  value: string;
};

type SubCatsRef = {
  id: string;
  contentType: string;
  _meta: Meta;
};

type Thumbnail = {
  id: string;
  name: string;
  endpoint: string;
  defaultHost: string;
  _meta: Meta;
};

type CategoriesContent = {
  priority: number;
  title: string;
  imageAltText: string;
  description: string;
  subCats: SubCatsRef[];
  thumbnail: Thumbnail;
  _meta: Meta;
};

type DepartmentCategories = {
  content: CategoriesContent;
};

type SubCats = {
  priority: number;
  title: string;
  description: string;
  imageAltText: string;
  thumbnail: Thumbnail;
  _meta: Meta;
};

type TopCategories = {
  priority: number;
  title: string;
  subCats: SubCats[];
  thumbnail: Thumbnail;
  _meta: Meta;
};

type ShopSale = {
  priority: number;
  title: string;
  subCats: SubCats[];
  thumbnail: Thumbnail;
  _meta: Meta;
};

type Carousel = {
  topCategories: TopCategories[];
  shopSale: ShopSale[];
  productSelector: ProductSelector;
};

type SeoContent = {
  title: string;
  description: string;
};

type Image = {
  _meta: Meta;
  defaultHost: String;
  endpoint: String;
  id: String;
  name: String;
  url: String;
};

type Media = {
  image: Image;
  imageAltText: String;
  _meta: Meta;
};

type SecondaryPromoComponent = {
  _meta: Meta;
  Promos: [PromoCard];
  Title: String;
};

type PromoCard = {
  _meta: Meta;
  link: String;
  media: Media;
  discountLabel: String;
  description: String;
};

type Promos = {
  secondary: SecondaryPromoComponent;
  primary: PromoCard;
};

type Labels = {
  sideNav: string;
  categoryCarousel: string;
  shopSaleCarousel: string;
  topCategoriesCarousel: string;
};

type PageContent = {
  carousel: Carousel;
  seoContent: SeoContent;
  breadCrumbs: BreadCrumb[];
  promos: Promos;
  labels: Labels;
  title: string;
  _meta: Meta;
};

type DepartmentCategoriesAndPageContent = {
  metaData: MetaData;
  categories: DepartmentCategories[];
  page: PageContent;
};

type CategoryPageContent = {
  heroSlot: HeroSlot;
  filterLabel: String;
  resultsLabel: String;
  subCategories: CategoriesCarousal;
  promos: PromoCard;
  enableAdTile: Boolean;
  adTile: AdTile;
  seoContent: SeoContent;
  recentlyViewed: string[];
  relatedCategories: CategoriesCarousal;
  metaData: MetaData;
};

type CategoriesCarousal = {
  title: String;
  carousal: SubCats[];
};

type AdTile = {
  _meta: Meta;
  discountInfo: String;
  media: Media;
  tilePosition: Number;
  pageNumber: Number;
  link: String;
};

type CategoryBreadCrumb = {
  name: String;
  key: String;
  slug: String;
  url: String;
  parentBreadCrumb: CategoryBreadCrumb;
};

type CategoryPageData = {
  categoryKey: String;
  breadCrumbs: ContentPageBreadcrumb;
  clpPageContent: CategoryPageContent;
  serverState?: InstantSearchServerState;
  url?: any;
  initialPageLoad: boolean;
  gtmData: CategoryGtmDataLayer;
  getCategoryDetails: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
  };
  sessionId?: string;
};

export type { DepartmentCategoriesAndPageContent, CategoryPageData, CategoryBreadCrumb };
