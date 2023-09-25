import { PdpPageContent } from '../schema/pdp/pdpContent.schema';
import { PdpPageData, Variant } from '../schema/pdp/pdpData.schema';
import { Ga4ViewItemEcommerce } from 'src/interfaces/ga4Ecommerce';

type PdpTypeCompiled = {
  pdpPageContent: PdpPageContent;
  pdpPageData: PdpPageData;
};
type PdpData = {
  pdpPageData: PdpPageData;
  pdpPageContent: PdpPageContent;
  gtmData: Ga4ViewItemEcommerce;
  productJsonLdProps: {
    productName: string;
    images: string[];
    description: string;
    sku: string;
    brand: string;
    aggregateRating: {
      ratingValue: number;
      reviewCount?: number;
      ratingCount?: number;
      bestRating?: number;
    };
  };
  initialVariant: Variant;
  recentlyViewed: string[];
  canonicalUrl: string;
};

export type { PdpTypeCompiled, PdpPageData, PdpData };
