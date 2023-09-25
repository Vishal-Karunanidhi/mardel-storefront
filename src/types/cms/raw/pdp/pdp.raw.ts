import { PdpPageContent } from '../../schema/pdp/pdpContent.schema';
import { PdpPageData } from '../../schema/pdp/pdpData.schema';

type PdpTypeRaw = {
  data: {
    pdpPageContent: PdpPageContent;
    getProductDetails: PdpPageData;
  };
};

type PdpTypeRawSKU = {
  data: {
    pdpPageContent: PdpPageContent;
    getProductBySku: PdpPageData;
  };
};

export type { PdpTypeRaw, PdpTypeRawSKU };
