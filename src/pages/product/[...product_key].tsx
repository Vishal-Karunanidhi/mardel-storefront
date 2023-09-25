import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { createContext, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from '@Redux/store';

import AccordionSlot from '@Components/productDetailPage/accordianSlot';
import ProductDetails from '@Components/productDetailPage/productDetails';
import ProductImages from '@Components/productDetailPage/productImages';
import ProductOptions from '@Components/productDetailPage/productOptions/productOptions';
import WarningAndDisclaimer from '@Components/common/warningAndDisclaimer';
import ProductAvailable from '@Components/productDetailPage/productAvailable/productAvailable';
import ShareButton from '@Components/common/shareButton';

import { PdpData } from '@Types/cms/compiled/pdp.compiled';
import { Variant, VariantPicker } from '@Types/cms/schema/pdp/pdpData.schema';
import styles from '@Styles/productDetailPage/pdpIndex.module.scss';

import {
  getProductPageContent,
  getProductPageDetails,
  invokeProductDetailsEventCall
} from '@Lib/cms/productDetailsPage';
import Breadcrumb from '@Components/breadcrumb/breadcrumb';
import FeaturedItems from '@Components/homepage/featuredItems';

import {
  addProductKeyToRecentlyViewed,
  getCookieData,
  redirectTo404Page
} from '@Lib/common/serverUtility';
import ReviewAndQA from '@Components/productDetailPage/reviewAndQA/reviewAndQA';
import AlgoliaProductsSuggestion from '@Components/plp/algoliaProductsSuggestion';
import { ProductJsonLd } from 'next-seo';
import SeoHead from '@Components/common/seoHead';
import { Ga4ViewItemEcommerce } from 'src/interfaces/ga4Ecommerce';
import { AuthState } from '@Types/globalState';

export const ProductContext =
  createContext<[Variant, Dispatch<SetStateAction<Variant>>]>(undefined);

let prevPath = '';
export default function ProductDetailPage(props: PdpData) {
  const {
    pdpPageContent,
    pdpPageData,
    productJsonLdProps,
    gtmData,
    initialVariant,
    recentlyViewed,
    canonicalUrl
  } = props;
  const { asPath } = useRouter();
  const { pageType } = useSelector((state) => state.layout) ?? {};
  const {
    heartBeatInfo: { isLoggedInUser, sessionId }
  } = useSelector((state) => state.auth) ?? {};
  const selectedVariantState = useState<Variant>(initialVariant);
  const [selectedVariant] = selectedVariantState;
  const { myProfileInfo } = useSelector((state: { auth: AuthState }) => state.auth) ?? {};

  //  TODO: ensure props are in a valid, expected state
  //   if they are not, throw to an error page and remove all optional chaining below

  let productAccordianCmsDetails = [
    {
      title: pdpPageContent?.productDescriptionTitle,
      content: pdpPageData?.description
    },
    {
      title: pdpPageContent?.productSpecsTitle,
      content: selectedVariant?.attributes?.description
    },
    {
      title: pdpPageContent?.shipping?.label,
      content: pdpPageContent?.shipping?.richTextData
    },
    {
      title: pdpPageContent?.returns?.label,
      content: pdpPageContent?.returns?.richTextData
    }
  ];

  if (pageType.isGiftCardsDetailsPage) {
    productAccordianCmsDetails = [
      {
        title: pdpPageContent?.productDescriptionTitle,
        content: selectedVariant?.attributes?.description
      }
    ];
  }

  useEffect(() => {
    async function invokeProductDetailsEvent() {
      const variantIds = [selectedVariant?.key];
      await invokeProductDetailsEventCall(variantIds);
    }
    if (prevPath !== asPath) {
      invokeProductDetailsEvent();
      prevPath = asPath;
    }
  }, [asPath]);

  useEffect(() => {
    if (pdpPageData) {
      var categories = [];
      if (pdpPageData.breadCrumbLinks?.length > 2) {
        var breadcrumbs = pdpPageData.breadCrumbLinks.slice(1, -1);
        breadcrumbs.forEach((breadcrumb, index) => {
          categories[index] = breadcrumb.name;
        });
      }
      gtmData.ecommerce.items = [
        {
          affiliation: '',
          coupon: '',
          currency: 'USD',
          discount: selectedVariant.price?.discountedPrice?.discountedPrice
            ? selectedVariant.price.variantPrice -
              selectedVariant.price.discountedPrice.discountedPrice
            : 0,
          index: '',
          item_brand: selectedVariant.attributes.brand?.label,
          item_category: categories[0] || '',
          item_category2: categories[1] || '',
          item_category3: categories[2] || '',
          item_category4: categories[3] || '',
          item_category5: categories[4] || '',
          item_id: selectedVariant.sku,
          item_list_id: '',
          item_list_name: '',
          item_name: pdpPageData.name,
          item_variant: '',
          price:
            selectedVariant.price?.discountedPrice?.discountedPrice ||
            selectedVariant.price.variantPrice,
          quantity: 1 // we may want to grab the quantity on page in the future, although unsure how important that would be
        }
      ];
      gtmData.event = 'view_item';
      gtmData.email = '';
      gtmData.value =
        selectedVariant.price?.discountedPrice?.discountedPrice ||
        selectedVariant.price.variantPrice;

      if (myProfileInfo && myProfileInfo.email) {
        gtmData.email = myProfileInfo.email;
      }

      if (sessionId) {
        isLoggedInUser ? (gtmData.user_id = sessionId) : (gtmData.anonymous_user_id = sessionId);
      }

      // call GTM push
      if (window) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(gtmData);
      }
    }
  }, [selectedVariant]);

  return (
    <>
      <ProductJsonLd {...productJsonLdProps} />
      {selectedVariant && (
        <>
          {pdpPageData?.breadCrumbLinks && (
            <Breadcrumb breadCrumbs={pdpPageData.breadCrumbLinks} hideOptionalHeader={true} />
          )}
          <ProductContext.Provider value={selectedVariantState}>
            <div className={styles.pdp}>
              <div className={styles.pdpTop}>
                <ProductImages pdpPageData={pdpPageData} />
                <div className={styles.pdpTopDetails}>
                  <ProductDetails
                    productName={pdpPageData.name}
                    averageRating={pdpPageData.rating?.averageRating}
                    reviewCount={pdpPageData.rating?.numberOfRatings}
                  />
                  {pdpPageData.variantPicker && pdpPageData.variantOptions && (
                    <ProductOptions
                      variantOptions={pdpPageData.variantOptions}
                      variantPicker={pdpPageData.variantPicker as VariantPicker[]}
                      variantPickerKeys={pdpPageData.variantPickerKeys}
                      variants={pdpPageData.variants}
                      selectedVariantState={selectedVariantState}
                    />
                  )}
                  <ProductAvailable
                    productType={pdpPageData.productType}
                    variant={selectedVariant}
                    nonPdpPage={false}
                    productName={pdpPageData.name}
                  />
                  {selectedVariant.attributes.productWarnings && (
                    <WarningAndDisclaimer
                      warningIcon={pdpPageContent.warningIcon}
                      warningMessage={selectedVariant.attributes.productWarnings.label}
                      disclaimer={pdpPageContent.disclaimer}
                    />
                  )}
                  <ShareButton
                    header={pdpPageData.name}
                    shareType="Product"
                    productSku={selectedVariant.sku}
                  />
                </div>
              </div>

              {productAccordianCmsDetails?.map((accordProps, index) => (
                <AccordionSlot key={index} {...accordProps} />
              ))}

              <AlgoliaProductsSuggestion />
              {!pageType.isGiftCardsDetailsPage && (
                <ReviewAndQA
                  pdpPageData={pdpPageData}
                  reviews={pdpPageData.reviews}
                  rating={pdpPageData.rating}
                  productKey={pdpPageData.productKey}
                />
              )}
            </div>
            <div className={styles.featuredItems}>
              {recentlyViewed.length > 0 && (
                <FeaturedItems
                  label="Recently Viewed" // label is hardcoded. not sure if it should be more extensible {pdpPageContent.recentlyViewed.label}
                  products={recentlyViewed}
                />
              )}
            </div>
          </ProductContext.Provider>
        </>
      )}
      <SeoHead
        title={`${pdpPageData.name} | Hobby Lobby | ${selectedVariant.sku}`}
        description={pdpPageData.description?.split('</p>')[0]?.replace('<p>', '')}
        canonical={canonicalUrl}
      />
    </>
  );
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<PdpData>> {
  const { product_key } = context.query;
  // TODO: handle a undefined product_key
  const key = product_key.at(-1) + '';
  // TODO: initialize productDetailPageData or handle it if it is allowed to be null
  const [pdpPageData, pdpPageContent] = await Promise.all([
    getProductPageDetails({
      key,
      isActiveVariants: false,
      isStaged: false
    }),
    getProductPageContent()
  ]);

  /*Redirect to 404 page when Product is not found*/
  if (!pdpPageData) {
    return redirectTo404Page();
  }

  const variants = pdpPageData.variants;
  let initialVariant: Variant = variants.find<Variant>(
    (variant): variant is Variant => variant.key === key
  );

  if (!initialVariant && pdpPageData.productKey === key) {
    initialVariant = variants.find<Variant>(
      (variant): variant is Variant => variant.isMasterVariant
    );
  }

  // TODO: may need to do some DONOTTRACK/GPC logic
  const { req, res } = context;

  let recentlyViewedKeys = addProductKeyToRecentlyViewed(req, res, pdpPageData.productKey);
  const existingProductKeyIndex = recentlyViewedKeys.findIndex((k) => k === pdpPageData.productKey);

  const gtmData: Ga4ViewItemEcommerce = {
    anonymous_user_id: '',
    event: 'page_view',
    currency: 'USD',
    ecommerce: {
      items: []
    },
    value: 0,
    user_id: ''
  };

  // Remove current product key from array if it currently exists
  if (existingProductKeyIndex !== -1) {
    recentlyViewedKeys.splice(existingProductKeyIndex, 1);
  }

  const recentlyViewed = recentlyViewedKeys;

  const { name } = pdpPageData;

  if (name) {
    pdpPageData.breadCrumbLinks.push({
      name,
      key: name,
      slug: name,
      openInNewTab: false
    });
  }

  const pdpData = pdpPageData;

  /* TODO: Figure a way to get the fetch call to retrive product image set working
    const imageSet = await (await fetch(selectedVariant.imageSet + '.json')).json();
    const imageUrl = imageSet.items.map((image) => image.src);
  */
  const imageUrl = [initialVariant.imageSet];

  let bestReview = null;
  if (pdpData.reviews && pdpData.reviews.length > 0) {
    bestReview = pdpData.reviews[0];
    if (pdpData.reviews.length > 1) {
      bestReview = pdpData.reviews.reduce((prevReview, currentReview) => {
        return currentReview.rating > prevReview.rating ? currentReview : prevReview;
      });
    }
  }

  const productJsonLdProps = {
    productName: pdpData.name,
    images: imageUrl,
    description: pdpData.description,
    sku: initialVariant.sku,
    brand: initialVariant.attributes.brand ? initialVariant.attributes.brand?.label : '',
    aggregateRating:
      pdpData.rating.numberOfRatings > 0
        ? {
            ratingValue: pdpData.rating.averageRating,
            reviewCount: pdpData.rating.numberOfRatings
          }
        : null,
    reviews: bestReview
      ? {
          author: bestReview.authorName ? bestReview.authorName : 'Anonymous',
          datePublished: bestReview.createdAt,
          reviewBody: bestReview.text,
          name: bestReview.title,
          reviewRating: {
            ratingValue: bestReview.rating,
            bestRating: '5'
          }
        }
      : null,
    offers: {
      price: initialVariant.price.discountedPrice
        ? initialVariant.price.discountedPrice.discountedPrice
        : initialVariant.price.variantPrice,
      priceCurrency: 'USD',
      itemCondition: 'https://schema.org/NewCondition',
      url: `https://www.hobbylobby.com${initialVariant.url}`,
      seller: {
        name: 'Hobby Lobby'
      }
    }
  };

  /** Canonical Url for the PDPs to avoid duplicate products in sitemap */
  const hostUrl = process.env.HOST_URL;
  /** Setting Canonical Url for PDPs of variant products
   * All the variants and their base product need to use the base product url as the Canonical Url
   */
  let canonicalUrl = hostUrl + pdpPageData.pdpUrl;
  if (pdpPageData.variants.length == 1) {
    /** Setting Canonical Url for non-variant products
     * The non-variant product and its base product need to use the variant(product) url as the Canonical Url
     */
    const variantProductUrl = pdpPageData.variants[0].url;
    canonicalUrl = hostUrl + variantProductUrl;
  }

  return {
    props: {
      pdpPageData,
      pdpPageContent,
      gtmData,
      productJsonLdProps,
      initialVariant,
      recentlyViewed,
      canonicalUrl
    }
  };
}
