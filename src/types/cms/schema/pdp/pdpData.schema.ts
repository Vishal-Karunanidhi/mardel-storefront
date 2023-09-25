import { CategoryBreadCrumb } from '../plp/plpContent.schema';

type OnlineStatus = {
  __typename: string;
  key: string;
  label: string;
};
type ProductEnum = {
  key: string;
  label: string;
};
type Attributes = {
  __typename: string;
  approvalStatus: boolean;
  productOnlineDate: Date;
  assorted: boolean;
  backInStockEligible: boolean;
  description: string;
  additionalShipping: number;
  ormd: boolean;
  excludeFreeShipping: boolean;
  yourPrice: boolean;
  downloadableMedias?: ProductEnum;
  excludedStates?: ProductEnum;
  offlineDate?: string;
  onlineDate?: string;
  vendorName?: ProductEnum;
  vendorSku?: ProductEnum;
  onlineStatus: OnlineStatus;
  availability?: ProductEnum;
  brand?: ProductEnum;
  collection?: ProductEnum;
  color?: ProductEnum;
  colorFamily?: ProductEnum;
  dimensions?: ProductEnum;
  lettersNumbers?: ProductEnum;
  material?: ProductEnum;
  paperFinish?: ProductEnum;
  paperType?: ProductEnum;
  pattern?: ProductEnum;
  productHazards?: ProductEnum;
  productUnit?: ProductEnum;
  productWarnings?: ProductEnum;
  ribbonContent?: ProductEnum;
  ribbonType?: ProductEnum;
  ribbonWidth?: ProductEnum;
  saleType?: ProductEnum;
  seasonCode?: ProductEnum;
  size?: ProductEnum;
  theme?: ProductEnum;
  vinylFinish?: ProductEnum;
  vinylType?: ProductEnum;
  volume?: ProductEnum;
  knobShape?: ProductEnum;
  lampHeight?: ProductEnum;
  letter?: ProductEnum;
  mirrorType?: ProductEnum;
  orientation?: ProductEnum;
  room?: ProductEnum;
  shape?: ProductEnum;
  type?: ProductEnum;
  buttonType?: ProductEnum;
  colorNumber?: ProductEnum;
  fiber?: ProductEnum;
  bristle?: ProductEnum;
  brushShape?: ProductEnum;
  hardness?: ProductEnum;
  length?: ProductEnum;
  medium?: ProductEnum;
  quantity?: ProductEnum;
  tipSize?: ProductEnum;
  candleHolderType?: ProductEnum;
  candleType?: ProductEnum;
  flameType?: ProductEnum;
  scent?: ProductEnum;
  partyType?: ProductEnum;
  themeFamily?: ProductEnum;
  age?: ProductEnum;
  clayType?: ProductEnum;
  paintFinish?: ProductEnum;
  setDisclaimer?: ProductEnum;
  woodFinish?: ProductEnum;
  sportsTeam?: ProductEnum;
  university?: ProductEnum;
  width?: ProductEnum;
  flowerType?: ProductEnum;
  frameShape?: ProductEnum;
  coin?: ProductEnum;
  scale?: ProductEnum;
  skillLevel?: ProductEnum;
  guage?: ProductEnum;
  metalColor?: ProductEnum;
  articleNumber?: ProductEnum;
  yarnWeight?: ProductEnum;
  number?: ProductEnum;
  christmasLights?: ProductEnum;
  ornamentMaterial?: ProductEnum;
  sizeGrouping?: ProductEnum;
  subject?: ProductEnum;
  treeHeight?: ProductEnum;
  treeShape?: ProductEnum;
};

type DiscountedPrice = {
  __typename: string;
  discountedPrice: number;
  discountName: string;
  discountKey: string;
  discountId: string;
  isAlwaysOn?: Boolean;
};
type Price = {
  __typename: string;
  variantPrice: number;
  marketPrice: number;
  discountedPrice: DiscountedPrice;
};

type Variant = {
  __typename: string;
  id: number;
  sku: string;
  key: string;
  inStock: boolean;
  attributes: Attributes;
  price: Price;
  isMasterVariant: boolean;
  isMatchingVariant: boolean;
  imageSet: string;
  swatchUrl: string;
  url: string;
};

type ImageSet = {
  items: ImageItem[];
  name: string;
};

type ImageItem = {
  format: string;
  height: number;
  opaque: string;
  src: string;
  type: string;
  width: number;
};

type BreadCrumb = {
  __typename?: string;
  name: string;
  key: string;
  slug: string;
  openInNewTab: boolean;
};

type PdpPageData = {
  __typename: string;
  name: string;
  productKey: string;
  productType?: string;
  commercetoolsId: string;
  description: string;
  slug: string;
  variants: Variant[];
  variantOptions: VariantPickerOptions;
  variantPicker: VariantPicker[] | string;
  variantPickerKeys: VariantPickerKey[];
  breadcrumb: CategoryBreadCrumb;
  pdpUrl: string;
  productDetails: string;
  breadCrumbLinks?: any;
  reviews: Review[];
  rating: ProductRating;
};

type ProductRating = {
  averageRating: number;
  highestRating: number;
  lowestRating: number;
  numberOfRatings: number;
  ratingsDistribution: {
    fiveStarReviews: number;
    fourStarReviews: number;
    threeStarReviews: number;
    twoStarReviews: number;
    oneStarReviews: number;
  };
};

type ReviewsResponse = {
  reviews: Review[];
  page: number;
  totalCount: number;
  totalPages: number;
};

type Review = {
  id: string;
  key: string;
  createdAt: string;
  authorName: string;
  title: string;
  text: string;
  rating: number;
};

type CreateReviewRequest = {
  name: string;
  productKey: string;
  title: string;
  text: string;
  rating: number;
};

type CreateReviewResponse = {
  status: number;
  message: string;
  review: ProductReview;
};

type ProductReview = {
  id: string;
  key: string;
  createdAt: string;
  authorName: string;
  title: string;
  text: string;
  includedInStatistics: boolean;
  rating: number;
};

type VariantPicker = {
  variantKey: string;
  color: string;
  dimensions: string;
  guage: string;
  length: string;
  letter: string;
  quantity: string;
  size: string;
  volume: string;
  weight: string;
};

type VariantPickerKey = keyof VariantPicker;

type VariantPickerOptions = Record<VariantPickerKey, string[]>;

export type {
  OnlineStatus,
  Attributes,
  CreateReviewRequest,
  CreateReviewResponse,
  ProductEnum,
  DiscountedPrice,
  Price,
  Variant,
  ImageSet,
  ImageItem,
  BreadCrumb,
  PdpPageData,
  ProductRating,
  Review,
  ReviewsResponse,
  VariantPicker,
  VariantPickerKey,
  VariantPickerOptions
};
