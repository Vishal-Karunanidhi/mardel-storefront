import algoliasearch from 'algoliasearch/lite';
import { Attributes, BreadCrumb, Variant } from '@Types/cms/schema/pdp/pdpData.schema';
import { LinkWithLabel } from '@Types/shared';
import { CategoryBreadCrumb } from '@Types/cms/schema/plp/plpContent.schema';
import { ContentMainSection, ContentPageBreadcrumb } from '@Types/cms/schema/contentPage.schema';
import { defaultHomeBCrumbs } from '@Constants/generalConstants';
import { months } from '@Constants/storeFinderConstants';
import { currentDate, weekday } from '@Constants/storeFinderConstants';
import colors from '@Lib/common/colors';
import { useEffect, useRef, useState } from 'react';
import { Ga4EcommerceItem } from 'src/interfaces/ga4EcommerceItem';
import { Ga4ItemEcommerce } from 'src/interfaces/ga4Ecommerce';

export function imageURL(defaultHost: string, endpoint: string, image: string) {
  return `https://${defaultHost}/i/${endpoint}/${image}`;
}

export function imageUrlQuery(imageUrl: string, dimension: number, dimensionH?: number): string {
  if (imageUrl) {
    return imageUrl + `?fmt=webp&w=${dimension}&h=${dimensionH || ''}&sm=c`;
  }
}

export function imageLoader(imageUrl: string) {
  return process.env.ASSET_PREFIX ? process.env.ASSET_PREFIX + imageUrl : imageUrl;
}

export function formatDataTestId(inputString) {
  return inputString?.replace(/ /g, '-').toLowerCase();
}

export function formatPhoneNumber(number: string): string {
  return `(${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6, 10)}`;
}

export function formatTime(time: string): string {
  if (time[0] === '0') {
    return time.slice(1);
  } else return time;
}

export function formatStreet(street: string): string {
  const sliceIndex = street.indexOf(' ');
  return street.slice(sliceIndex);
}

export const storeHours = (store): string => {
  const currentDayData = store.thisWeek.hours.find((day) => {
    return day.day === weekday[currentDate.getDay()];
  });

  if (currentDayData.startTime === 'Closed') {
    return 'Closed today';
  }

  return `Open today ${formatTime(currentDayData.startTime)} - ${formatTime(
    currentDayData.endTime
  )}`;
};

const customAlgoliaSearchClient = (pageType) => {
  return {
    search(requests) {
      if (pageType === 'autoComplete') {
        const isInitialLoad = requests.some((request) => {
          return !request?.query && !request?.params?.query;
        });
        if (isInitialLoad) {
          return Promise.resolve({
            results: requests.map(() => ({
              hits: [],
              nbHits: 0,
              nbPages: 0,
              page: 0,
              processingTimeMS: 0,
              hitsPerPage: 0,
              exhaustiveNbHits: false,
              query: '',
              params: ''
            }))
          });
        }
      }

      return fetch(process.env.NEXT_PUBLIC_ALGOLIA_PROXY, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ requests })
      })
        .then((res) => res.json())
        .catch((err) => console.log('Error Occured at Algolia Proxy', err));
    }
  };
};

function getAlgoliaIndexName(pageType = 'PLP') {
  let indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME ?? 'HLNextGenEcommIndex_snd';
  if (pageType === 'DIY') {
    indexName =
      process.env.NEXT_PUBLIC_ALGOLIA_DIY_INDEX_REPLICA_DATE_MOST_RECENT ??
      'HLNextGenEcommIndex_snd_createdAt_descending';
  }
  return indexName;
}

function getAlgoliaEnvProps(pageType = 'PLP') {
  /* // Aloglia Default Search client with app-id&key
    const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
    const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_API_KEY;
    const searchClient = algoliasearch(appId, apiKey);
    */

  const indexName = getAlgoliaIndexName(pageType);
  return {
    searchClient: customAlgoliaSearchClient(pageType),
    indexName
  };
}

function isSubCategory(categoryKey) {
  const subCatRegex = /^\d{2}[-]\d{3}[-]\d{4}$/;
  return subCatRegex.test(categoryKey);
}

function formatCategoryCarousel(data) {
  return {
    labels: {
      categoryCarousel: data?.title
    },
    cards: data?.carousal?.map((e) => ({ content: { ...e } }))
  };
}

function trimObjects(data) {
  let trimmedObject = {
    ...data
  };
  Object.keys(data).forEach((key) => {
    switch (typeof data[key]) {
      case 'string':
        trimmedObject[key] = data[key].trim();
        break;
      case 'number':
      case 'object':
      case 'boolean':
      default:
        break;
    }
  });
  return trimmedObject;
}

function roundOfPriceValue(value) {
  if (!value) {
    return '—';
  }
  const parsedValue = parseFloat(value).toFixed(2);
  return `$${parsedValue}`;
}
// Using this function will return a string with the $ so it will not be needed for pricing.
// It also takes the price and adds 00's after the decimal point. Etc $16.00 instead of $16
function fixForItemPricesWithoutChange(value): string {
  if (!value) {
    return '$0.00';
  }
  return '$' + parseFloat(value).toFixed(2);
}

/*BCrumb component Formatting*/
function contentToBreadcrumb(contentCrumbs: ContentPageBreadcrumb): BreadCrumb[] {
  return contentCrumbs?.links?.map((crumb: LinkWithLabel) => {
    return {
      __typename: 'Breadcrumb',
      name: crumb.label,
      key: crumb.value,
      slug: crumb.value,
      openInNewTab: crumb.openInNewTab
    } as BreadCrumb;
  });
}

/*Gql BCrumb Processor*/
function formatBreadcrumbsData(categoryBreadCrumb: CategoryBreadCrumb, links = []) {
  const firstLink = !links.length;
  const { parentBreadCrumb, name: label, url: value, key } = categoryBreadCrumb;
  links.push({
    key,
    label,
    value,
    openInNewTab: false
  });
  if (parentBreadCrumb) {
    formatBreadcrumbsData(parentBreadCrumb, links);
  }
  if (firstLink) {
    links.push(defaultHomeBCrumbs);
    links.reverse();
  }
  return { links };
}

function getPageProtocol(req) {
  return req.headers.referer?.split('://')[0] || 'https';
}

function constructSsrUrl(req) {
  const protocol = getPageProtocol(req);
  return `${protocol}://${req.headers.host}${req.url}`;
}

function constructSsrOrigin(req) {
  const protocol = req?.headers?.['x-forwarded-proto'];
  const host = req?.headers?.host;
  return `${protocol}://${host}`;
}

function extractSearchQuery(queryObj) {
  const searchParam = Object.keys(queryObj).find((e) => e.indexOf('[configure][query]') !== -1);
  return queryObj[searchParam] ?? '';
}

function getPromoBadge(badgeData) {
  const { productOnlineDate, discountedPricePerQuantity } = badgeData;
  let promoBadge = '';
  let daysSinceOnline = -1;
  if (productOnlineDate) {
    const today = new Date();
    const dateAdded = new Date(productOnlineDate);
    const timeDifference = today.getTime() - dateAdded.getTime();
    daysSinceOnline = timeDifference / (1000 * 3600 * 24);
  }

  if (discountedPricePerQuantity) {
    promoBadge = 'SALE';
  } else if (daysSinceOnline >= 0 && daysSinceOnline < 60) {
    promoBadge = 'NEW';
  }
  return promoBadge;
}

function phoneNumberMask(phone) {
  const areaCode = phone?.slice(2, 5);
  if (areaCode) {
    return `${areaCode}-***-****`;
  } else {
    return '***-****';
  }
}

function formatMobileNumber(number) {
  var match = number?.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return match[1] + '-' + match[2] + '-' + match[3];
  }
  return number;
}

function titleCase(title: string[] | string | undefined): string {
  if (title === undefined) return '';
  if (!Array.isArray(title)) {
    title = (title as string).toLowerCase().split(' ');
  }

  for (let i = 0; i < title.length; i++) {
    title[i] = title[i].charAt(0).toUpperCase() + title[i].slice(1);
  }

  return title.join(' ');
}

type AvailabilityStatus =
  | 'See Options'
  | 'In store only'
  | 'Out of stock'
  | 'NotifyMe'
  | 'AddToCart'
  | 'Online only'
  | 'OOS Online'
  | 'View Product'
  | '';

function productStatus(variant?: Variant, product?: any, nonPdpPage = true): AvailabilityStatus {
  const isGiftCardSku = checkGiftCard(product?.variants ?? []);
  if (product) {
    if (product.variants.length <= 0) return '';
    if (isGiftCardSku) return 'See Options';
    if (product.variants.length > 1) {
      let status = 'View Product';
      ['In store only', 'Online only', 'Out of stock'].forEach((element) => {
        if (
          product.variants.every(
            (variant: Variant) => variantStatus(variant, nonPdpPage) === element
          )
        ) {
          status = element;
        } else if (
          product.variants.some(
            (variant: Variant) => variantStatus(variant, nonPdpPage) === 'AddToCart'
          )
        ) {
          status = 'See Options';
        }
      });
      return status as AvailabilityStatus;
    }
    return variantStatus(product.variants[0], nonPdpPage);
  }
  return variantStatus(variant, nonPdpPage);
}

function variantStatus(variant: Variant, nonPdpPage: boolean): AvailabilityStatus {
  const attributes: Attributes = variant?.attributes;

  if (!attributes?.approvalStatus || attributes?.onlineStatus.key === 'inactive') return '';
  if (attributes?.availability?.label === 'IN_STORE_ONLY') {
    return 'In store only';
  }
  if (attributes?.availability?.label === 'ONLINE_ONLY') {
    if (!nonPdpPage) return '';
    return 'Online only';
  }
  if (attributes?.availability?.label === 'OOS_ONLINE') {
    return 'OOS Online';
  }

  const currentDate: Date = new Date();
  const onlineDate: Date = new Date(attributes.onlineDate || undefined);
  const offlineDate: Date = new Date(attributes.offlineDate || undefined);
  if (onlineDate.toDateString() !== 'Invalid Date' && currentDate < onlineDate) {
    if (!nonPdpPage) return '';
    return 'Out of stock';
  }
  if (offlineDate.toDateString() !== 'Invalid Date' && !(currentDate < offlineDate)) {
    if (!nonPdpPage) return '';
    return 'Out of stock';
  }

  const backInStockEligible: boolean = attributes.backInStockEligible;
  if (!variant.inStock) {
    if (!backInStockEligible) {
      return 'Out of stock';
    }
    return 'NotifyMe';
  }

  return 'AddToCart';
}

const variantStatusLabel = (status: string): { availability: string; color: any } => {
  switch (status) {
    case 'See Options':
    case 'AddToCart':
      return { availability: 'IN STOCK', color: colors.hlBlue };
    case 'In store only':
      return { availability: 'IN STORE ONLY', color: colors.hlBlue };
    case 'Online only':
      return { availability: 'ONLINE ONLY', color: colors.hlBlue };
    case 'Out of stock':
    case 'NotifyMe':
      return { availability: 'OUT OF STOCK', color: colors.hlRed };
    default:
      return { availability: '', color: '' };
  }
};

function checkGiftCard(variants?: Array<Variant>) {
  return Boolean(variants?.find((item) => item.sku.indexOf('gc-') !== -1));
}

function base64Encode(password: string): string {
  return Buffer.from(password).toString('base64');
}

/* Formats month to MM */
function formatMonth(month: string): string {
  if (month && month?.length === 1 && month !== '0') {
    return month.padStart(2, '0');
  }
  return month;
}

function formatHolidayHoursDate(date: string) {
  const splitDate = date.split('/').map((num) => {
    return Number(num);
  });
  const month = months[splitDate[0] - 1];
  const day = splitDate[1];
  return `${month} ${day}`;
}

const mockFn = () => {};

/*Function to execute as last-item in EventLoop*/
function executeFnLastInEventQueue(functionToTrigger, inputArgs, timeSpan = 0) {
  let argsToPass = inputArgs;
  if (!Array.isArray(inputArgs)) {
    argsToPass = [inputArgs];
  }
  setTimeout(() => functionToTrigger(...argsToPass), timeSpan);
}

function formatQuantity(quantity: string) {
  return /^([0-9]{0,4})$/.test(quantity);
}

const validateEmail = (input: string) => {
  if (input) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input);
  }
};

const printBodyItems = () => {
  window.onbeforeprint = () => {
    document.body.classList.add('print');
  };
  window.onafterprint = () => {
    document.body.classList.remove('print');
  };
  window.print();
};

// This makes topics and questions in the FAQ section URL-friendly by replacing spaces with dashes
// This is important because the other FAQ pages use the URL to find out what topic/question should be displayed
const urlFriendly = (content: string) => {
  return content
    .replace(/ /g, '-')
    .replace(/[\?,.;:&'"’‘”“\!]/g, '')
    .toLowerCase();
};

const getYear = () => {
  return new Date().getFullYear();
};

const getErrorsFromBff = ({ errors, defaultMessage }) => {
  return {
    isError: true,
    bffErrorMessage: errors?.[0]?.extensions?.error?.['message'] ?? defaultMessage
  };
};

const getGiftCardsFromSession = () => {
  try {
    return sessionStorage?.getItem('giftCards')
      ? JSON?.parse(sessionStorage?.getItem('giftCards'))
      : [];
  } catch (err) {
    return [];
  }
};

/* TODO: Refactor all other contentPage instances to utilize this method here and
eliminate code duplication across the pages.
Add the switch cases based on your component. For example:
case 'ContentPageImage':
  // Handle ContentPageImage
case 'ContentCTA':
  // Handle ContentMainSection
case 'OrganizationList':
  // Handle OrganizationList
*/

const extractContentPageDetails = (contentPage: any) => {
  type Props = {
    breadcrumbs: BreadCrumb[];
    mainSection: ContentMainSection[];
    contentImageSection: MediaImage[];
  };
  let breadcrumbs: ContentPageBreadcrumb | null = null;
  let mainSection: ContentMainSection[] = [];
  let contentImageSection: MediaImage[] = [];

  contentPage?.content?.forEach((contentComponent: any) => {
    switch (contentComponent.__typename) {
      case 'ContentPageBreadcrumb':
        breadcrumbs = contentComponent;
        break;
      case 'ContentMainSection':
        mainSection.push(contentComponent);
        break;
      case 'ContentPageImage':
        contentImageSection.push(contentComponent.ContentImage);
        break;
      default:
        break;
    }
  });

  const BreadCrumbsData: BreadCrumb[] = contentToBreadcrumb(breadcrumbs);

  return {
    breadcrumbs: BreadCrumbsData,
    mainSection,
    contentImageSection
  } as Props;
};

function useVisibility<Element extends HTMLElement>(
  offset = 0
): [Boolean, React.RefObject<Element>] {
  const [isVisible, setIsVisible] = useState(false);
  const currentElement = useRef<Element>();

  const onScroll = () => {
    if (!currentElement.current) {
      setIsVisible(false);
      return;
    }
    const top = currentElement.current.getBoundingClientRect().top;
    setIsVisible(top + offset >= 0 && top - offset <= window.innerHeight);
  };

  useEffect(() => {
    document.addEventListener('scroll', onScroll, true);
    return () => document.removeEventListener('scroll', onScroll, true);
  });

  return [isVisible, currentElement];
}

// does not add a product to the ecommerce item list if the sku is not valid
function algoliaProductsToGtmItems(products: any[]): Ga4EcommerceItem[] {
  let newEcommerceItems: Ga4EcommerceItem[] = [];

  if (!products || products.length < 1) {
    return newEcommerceItems;
  }

  products.forEach((product) => {
    let productData = product;
    if (product.props) {
      productData = product.props.hit;
    }

    const {
      ['variant.price']: original,
      ['sku.discountedPrice']: discountedPrice,
      sku,
      productName
    } = productData;

    if (productData.sku && productData.sku !== undefined && productData.sku !== '') {
      let newEcommerceItem: Ga4EcommerceItem = {
        affiliation: '',
        coupon: '',
        currency: 'USD',
        discount: discountedPrice ? original - discountedPrice : 0,
        index: '',
        item_brand: '',
        item_category: '',
        item_category2: '',
        item_category3: '',
        item_category4: '',
        item_category5: '',
        item_id: sku,
        item_list_id: '',
        item_list_name: '',
        item_name: productName,
        item_variant: '',
        price: discountedPrice ? discountedPrice : original,
        quantity: 1
      };

      newEcommerceItems.push(newEcommerceItem);
    }
  });
  return newEcommerceItems;
}

// SUMMARY: creates a Ga4ItemEcommerce object, populates it for a `view_list_item` event,
// then pushes it into the datalayer
function handleProductViewListEvent(
  items: Ga4EcommerceItem[],
  listName: string = '',
  sessionId: string = '',
  isLoggedInUser: boolean = false
) {
  if (window) {
    const gtmData: Ga4ItemEcommerce = {
      event: 'view_item_list',
      item_list_id: '',
      item_list_name: listName,
      anonymous_user_id: '',
      ecommerce: {
        items: []
      },
      user_id: ''
    };

    if (sessionId) {
      isLoggedInUser ? (gtmData.user_id = sessionId) : (gtmData.anonymous_user_id = sessionId);
    }

    // TODO: need clarification on whether to populate and push if there are no ecommerce items
    if (items && items.length > 0) {
      gtmData.ecommerce.items = items;
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
    window.dataLayer.push(gtmData);
  }
}

// SUMMARY: creates a Ga4ItemEcommerce object, populates it for a `select_item` event, then pushes it into the datalayer
function handleProductSelectListItemEvent(
  item: Ga4EcommerceItem,
  listName: string = '',
  sessionId: string = '',
  isLoggedInUser: boolean = false
) {
  // there's no point in pushing this event if theres no item to push. should probably log an warning/error
  if (window && item) {
    const gtmData: Ga4ItemEcommerce = {
      event: 'select_item',
      item_list_id: '',
      item_list_name: listName,
      anonymous_user_id: '',
      ecommerce: {
        items: [item]
      },
      user_id: ''
    };

    isLoggedInUser
      ? (gtmData.user_id = sessionId || '')
      : (gtmData.anonymous_user_id = sessionId || '');

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
    window.dataLayer.push(gtmData);
  }
}

//showdown extension
/* TODO: Refactor all other contentPage instances to utilize this cookieBannerExtension method
 here and eliminate code duplication across the pages. */
const cookieBannerExtension = {
  type: 'lang',
  regex: /{show-cookie-banner text=["”]([A-Za-z ]+)["”]}/g,
  replace:
    '<a title="show cookie preferences" class="cookie-preferences optanon-toggle-display cookie-settings-button" style="cursor:pointer">$1</a>'
};

export {
  getAlgoliaEnvProps,
  formatCategoryCarousel,
  trimObjects,
  roundOfPriceValue,
  fixForItemPricesWithoutChange,
  isSubCategory,
  contentToBreadcrumb,
  formatBreadcrumbsData,
  constructSsrUrl,
  constructSsrOrigin,
  getPromoBadge,
  phoneNumberMask,
  formatMobileNumber,
  titleCase,
  productStatus,
  variantStatusLabel,
  base64Encode,
  formatMonth,
  formatHolidayHoursDate,
  extractSearchQuery,
  getAlgoliaIndexName,
  executeFnLastInEventQueue,
  mockFn,
  formatQuantity,
  validateEmail,
  printBodyItems,
  urlFriendly,
  getYear,
  getErrorsFromBff,
  checkGiftCard,
  getGiftCardsFromSession,
  extractContentPageDetails,
  cookieBannerExtension,
  useVisibility,
  algoliaProductsToGtmItems,
  handleProductViewListEvent,
  handleProductSelectListItemEvent
};
