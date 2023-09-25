import { fetchDataViaGql, fetchGqlData, modifyDataViaGql } from '@Graphql/client';
import GetVariantInventoryGQL from '@GqlQueries/headless/variantInventory.graphql';
import GetProductReviews from '@GqlQueries/headless/getReviewsForProduct.graphql';
import GetPdpDetailsGql from '@GqlQueries/headless/productDetailsPage.graphql';
import GetPdpContentGql from '@GqlQueries/headless/productDetailPageContent.graphql';
import GetPdpDetailsSKUGql from '@GqlQueries/headless/productDetailsPageSKU.graphql';
import GetRelatedProductsGql from '@GqlQueries/headless/getRelatedProducts.graphql';
import CreateReview from '@GqlMutations/createProductReview.graphql';
import InvokeProductDetailsEventGql from '@GqlMutations/invokeProductDetailsEvent.graphql';
import { InventoryTypeRaw } from 'src/types/cms/raw/pdp/inventory.raw';
import { InventoryTypeCompiled } from 'src/types/cms/compiled/inventory.compiled';
import { PdpTypeRaw } from 'src/types/cms/raw/pdp/pdp.raw';
import { PdpTypeCompiled } from 'src/types/cms/compiled/pdp.compiled';
import {
  CreateReviewRequest,
  CreateReviewResponse,
  PdpPageData,
  ReviewsResponse,
  VariantPicker,
  VariantPickerKey,
  VariantPickerOptions
} from 'src/types/cms/schema/pdp/pdpData.schema';
import GQL_CONST from '@Constants/gqlConstants';
import { contentToBreadcrumb, formatBreadcrumbsData } from '@Lib/common/utility';
import { PdpPageContent } from '@Types/cms/schema/pdp/pdpContent.schema';

async function getReviewsForProducts(
  productKey: string,
  pageNumber: number = 1
): Promise<ReviewsResponse> {
  const gqlArguments = {
    variables: {
      productKey,
      pageNumber
    }
  };
  try {
    const { data: getProductReviews }: { data: { getProductReviews: ReviewsResponse } } =
      await fetchDataViaGql(GetProductReviews, GQL_CONST._UNUSED, gqlArguments);
    return getProductReviews.getProductReviews;
  } catch (error) {
    console.error('getReviewsForProducts-----', error);
    return null;
  }
}

async function createProductReview(request: CreateReviewRequest): Promise<CreateReviewResponse> {
  const gqlArguments = { request };
  try {
    const { data }: { data?: { createReview: CreateReviewResponse } } = await modifyDataViaGql(
      CreateReview,
      gqlArguments
    );
    return data.createReview;
  } catch (error) {
    console.error('createProductReview-----', error);
    return null;
  }
}

/*
 * Retrieve Inventory Details for PDP - CSR
 */

async function getVariantInventoryDetails(variantKeys: string[]): Promise<InventoryTypeCompiled> {
  const gqlArguments = {
    variables: { variantKeys }
  };
  try {
    const { data: getInventoryDetails }: InventoryTypeRaw = await fetchDataViaGql(
      GetVariantInventoryGQL,
      GQL_CONST._UNUSED,
      gqlArguments
    );
    return getInventoryDetails;
  } catch (err) {
    console.error('getVariantInventoryDetails-----', err);
    return null;
  }
}

/*
 * Extract PDP CMS content & Product Details from CT
 */
async function getProductPageDetails(payload): Promise<PdpPageData> {
  const gqlArguments = {
    variables: { ...payload }
  };

  try {
    const { data }: PdpTypeRaw = await fetchDataViaGql(
      GetPdpDetailsGql,
      GQL_CONST._UNUSED,
      gqlArguments
    );
    const { getProductDetails: productDetails } = data;

    return processProductDetails(productDetails);
  } catch (err) {
    return null;
  }
}

async function getProductPageContent(): Promise<PdpPageContent> {
  try {
    const { data }: PdpTypeRaw = await fetchDataViaGql(GetPdpContentGql, GQL_CONST._UNUSED);
    const { pdpPageContent } = data;

    return pdpPageContent;
  } catch (err) {
    return null;
  }
}

async function getProductPageContentAndDatabySKU(payload): Promise<PdpTypeCompiled> {
  const variables = { ...payload };

  try {
    const { pdpPageContent, getProductBySku: productDetails } = await fetchGqlData(
      GetPdpDetailsSKUGql,
      variables
    );

    return {
      pdpPageContent,
      pdpPageData: processProductDetails(productDetails)
    };
  } catch (err) {
    console.error('getProductDetails-----', err);
    return null;
  }
}

function processProductDetails(productDetails: PdpPageData): PdpPageData {
  const { description, variantPicker } = productDetails;
  const productInfoAndSpec = description ? description.split('<p>Details:</p>') : [];

  const variantPickerParsed: VariantPicker[] = JSON.parse(variantPicker as string);
  const variantPickerKeys = Array.from(
    new Set(
      variantPickerParsed
        ? variantPickerParsed.flatMap((picker) => Object.keys(picker) as VariantPickerKey[])
        : []
    )
  );
  const variantOptions = getVariantOptions(variantPickerKeys, variantPickerParsed);

  return {
    ...productDetails,
    variantOptions,
    variantPicker: variantPickerParsed,
    variantPickerKeys: variantPickerKeys,
    description: productInfoAndSpec[0] || null,
    productDetails: productInfoAndSpec[1] || null,
    breadCrumbLinks: contentToBreadcrumb(formatBreadcrumbsData(productDetails?.breadcrumb))
  };
}

function getVariantOptions(
  variantPickerKeys: VariantPickerKey[],
  variantPicker: VariantPicker[]
): VariantPickerOptions {
  const options = {} as VariantPickerOptions;
  variantPickerKeys.forEach((key: VariantPickerKey) => {
    const keys: string[] = [];
    variantPicker.forEach((attribute: VariantPicker) => {
      if (keys.includes(attribute[key])) return;
      keys.push(attribute[key]);
    });
    options[key] = keys;
  });

  return options;
}

async function getRelatedProducts(objectId: string): Promise<any> {
  try {
    const { getRelatedProducts } = await fetchGqlData(GetRelatedProductsGql, {
      objectId: `${objectId}`
    });
    return getRelatedProducts;
  } catch (error) {
    return {};
  }
}

async function invokeProductDetailsEventCall(variantIds): Promise<any> {
  try {
    const data = await modifyDataViaGql(InvokeProductDetailsEventGql, { variantIds });
    return data;
  } catch (err) {
    return null;
  }
}

export {
  createProductReview,
  getVariantInventoryDetails,
  getProductPageDetails,
  getProductPageContent,
  getProductPageContentAndDatabySKU,
  getReviewsForProducts,
  getRelatedProducts,
  invokeProductDetailsEventCall
};
