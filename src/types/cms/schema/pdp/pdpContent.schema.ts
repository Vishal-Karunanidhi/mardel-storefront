import * as Shared from '../../../shared';

type AddToCart = {
  __typename: string;
  buttonTitle: string;
  cartCountPlaceholder: string;
};

type ShareProduct = {
  __typename: string;
  buttonTitle: string;
};

type Returns = {
  __typename: string;
  label: string;
  richTextData: string;
  richTextDataType: string;
};

type Shipping = {
  __typename: string;
  label: string;
  richTextData: string;
  richTextDataType: string;
};

type InventoryInfo = {
  __typename?: string;
  outOfStockMessage: string;
  inStockNotificationMessage: string;
  emailPlaceholder: string;
  emailNotifyButton: string;
  variantDetails?: any;
  nonPdpPage?: boolean;
  productName?: string;
};

type PdpPageContent = {
  __typename: string;
  _meta: Shared.Meta;
  addToCart: AddToCart;
  disclaimer: string;
  inventoryInfo: InventoryInfo;
  productDescriptionTitle: string;
  productSpecsTitle: string;
  recentlyViewed: string[]; //TODO: does this need to be here to work?
  returns: Returns;
  shareProduct: ShareProduct;
  shipping: Shipping;
  warningIcon: Shared.MediaImage;
};

export type { PdpPageContent, InventoryInfo, Shipping, Returns, ShareProduct, AddToCart };
