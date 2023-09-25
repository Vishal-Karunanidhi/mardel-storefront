import {
  useState,
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef
} from 'react';
import { useDispatch } from '@Redux/store';
import { renderToString } from 'react-dom/server';

import { GetServerSidePropsResult } from 'next/types';
import { InstantSearch, Configure, InstantSearchSSRProvider } from 'react-instantsearch-hooks-web';
import { getServerState } from 'react-instantsearch-hooks-server';
import { history } from 'instantsearch.js/es/lib/routers/index.js';

import { useSelector } from '@Redux/store';
import { Divider } from '@mui/material';
import { Drawer, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { HlPageLinkButton } from '@Components/common/button';
import Breadcrumb from '@Components/breadcrumb/breadcrumb';
import CustomHits from '@Components/plp/customHits';
import CustomPagination from '@Components/plp/customPagination';
import CustomDynamicWidgets from '@Components/plp/customDynamicWidgets';

import { FiltersContext } from '@Components/layout';
import SeoContent from '@Components/landingPage/department/components/seoContent';
import CategorySlider from '@Components/landingPage/department/components/categorySlider';
import { getCategoryDetailsData } from '@Lib/cms/plp';
import {
  getAlgoliaEnvProps,
  contentToBreadcrumb,
  formatCategoryCarousel,
  constructSsrUrl
} from '@Lib/common/utility';
import { getListingPageContentAndData, getGiftCardsContent } from '@Lib/cms/plp';
import { CategoryPageData } from '@Types/cms/schema/plp/plpContent.schema';

import listingPageStyles from '@Styles/plp/categoryListingPages.module.scss';
import ProductListSortByDrawer from '@Components/productDetailPage/productListSortByDrawer';
import FeaturedItems from '@Components/homepage/featuredItems';
import { getProductKeysFromCookie, getCookie, getCookieData } from '@Lib/common/serverUtility';
import DataLayer from '@Utils/DataLayer';
import SeoHead from '@Components/common/seoHead';
import { CategoryGtmDataLayer } from 'src/interfaces/gtmDataLayer';
import ProductListFooter from '@Components/productDetailPage/productListFooter';
import { AuthState } from '@Types/globalState';

const instantSearchProps = getAlgoliaEnvProps();
// TODO: set this initialization to a valid value or allow the type to be undefined
const PlpContext = createContext<[number, Dispatch<SetStateAction<number>>]>(undefined);

const GiftCardInfoComponent = () => {
  const { pageType } = useSelector((state) => state.layout) ?? {};
  const { heartBeatInfo } = useSelector((state) => state.auth) ?? {};

  if (!pageType?.isGiftCardsCategory) {
    return <></>;
  }

  return (
    <>
      <div className={listingPageStyles.giftCardInfoComp}>
        <label>
          <b>Already have a Gift Card? </b>
          <br />
          <br />
          Check your balance to see how much you have left to spend.
        </label>
        <HlPageLinkButton
          buttonTitle={<>&nbsp;&nbsp;Check balance&nbsp;&nbsp;</>}
          href={heartBeatInfo?.isGuestUser ? '/giftcard' : '/my-account#giftCardLookup'}
        />
      </div>
      <Divider className={listingPageStyles.dividerLine} />
    </>
  );
};

/*Run time Execution*/
export default function CategoryListPage(catProps: CategoryPageData) {
  const { myProfileInfo } = useSelector((state: { auth: AuthState }) => state.auth) ?? {};
  const { pageType } = useSelector((state) => state.layout) ?? {};
  const [initialPageLoad, setInitialPageLoad] = useState(catProps.initialPageLoad);
  const {
    breadCrumbs,
    categoryKey,
    clpPageContent,
    getCategoryDetails,
    gtmData,
    serverState,
    url,
    sessionId
  } = catProps;
  const { seoContent, relatedCategories } = clpPageContent;
  const { cards = [], labels } = formatCategoryCarousel(relatedCategories);
  const dispatch = useDispatch();

  let defaultHitsPerPage = 12;
  (() => {
    const { enableAdTile, adTile } = clpPageContent;
    if (enableAdTile && adTile?.pageNumber === 1) {
      /*TODO: Fix the tile based page loading*/
      // defaultHitsPerPage = 11;
    }
  })();
  const hitsPerPageStateHook = useState(defaultHitsPerPage);
  const {
    showPlpFiltersDrawer,
    setShowPlpFiltersDrawer,
    setShowPlpStickyFooter,
    setShowPlpSortBy,
    plpMobileFilterCount
  } = useContext(FiltersContext);
  const paginationElement = useRef(null);

  if (myProfileInfo && myProfileInfo.email) {
    gtmData.email = myProfileInfo.email;
  }

  useEffect(() => {
    document.addEventListener('scroll', handleShowPlpStickyFooter);
    return () => {
      document.removeEventListener('scroll', handleShowPlpStickyFooter);
    };
  }, []);

  useEffect(() => {
    async function getGiftCardsCmsData() {
      const giftCardData = await getGiftCardsContent();
      dispatch({
        type: 'UPDATE_GIFT_CARDS_CMS_DATA',
        payload: giftCardData
      });
    }
    getGiftCardsCmsData();
  }, []);

  const handleShowPlpStickyFooter = (event) => {
    // TODO: add null check validation on paginationElement & current before trying to call the function
    if (paginationElement?.current) {
      const { bottom } = paginationElement.current?.getBoundingClientRect();
      if (bottom <= 0) {
        setShowPlpStickyFooter(false);
      }
      if (bottom > 0) {
        setShowPlpStickyFooter(true);
      }
    }
  };

  const renderDrawer = (showPlpFiltersDrawer, setShowPlpFiltersDrawer) => {
    return (
      <Drawer
        ModalProps={{
          keepMounted: true
        }}
        PaperProps={{
          className: listingPageStyles.drawerPaperProps
        }}
        variant="temporary"
        anchor="left"
        open={showPlpFiltersDrawer}
        onClose={() => setShowPlpFiltersDrawer(false)}
        className={listingPageStyles.drawerStyles}
      >
        <div className={listingPageStyles.filtersHeaderContainer}>
          <div className={listingPageStyles.filtersTitle}>
            <IconButton
              aria-label="Filters"
              size="large"
              color="inherit"
              className={listingPageStyles.filtersIcon}
            >
              <img alt="Filters Icon" src={'/icons/filtersIcon.svg'} height="24" width="24" />
            </IconButton>
            <span className={listingPageStyles.filtersHeader}>Filters</span>
          </div>
          <div>
            <IconButton
              aria-label="Close"
              size="large"
              color="inherit"
              className={listingPageStyles.closeIcon}
              onClick={() => setShowPlpFiltersDrawer(false)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </div>
        </div>
        <CustomDynamicWidgets clpPageData={catProps} fromParentPageType={'PLP'} />
      </Drawer>
    );
  };

  const customHitsGiftClass = pageType?.isGiftCardsCategory
    ? listingPageStyles.giftCardsHitsDivision
    : '';

  return (
    <>
      <Breadcrumb breadCrumbs={contentToBreadcrumb(breadCrumbs)} />

      {clpPageContent.metaData && (
        <SeoHead
          title={clpPageContent.metaData?.title}
          description={clpPageContent.metaData?.description}
          additionalMetaTags={[
            {
              content: clpPageContent.metaData?.keywords,
              property: 'keywords'
            }
          ]}
        ></SeoHead>
      )}
      <GiftCardInfoComponent />

      {breadCrumbs && (
        <h2 className={listingPageStyles.heading}>
          Items related to {breadCrumbs?.links[breadCrumbs?.links.length - 1].label}
        </h2>
      )}

      {!breadCrumbs && <h2 className={listingPageStyles.heading}>Related Items</h2>}

      <PlpContext.Provider value={hitsPerPageStateHook} key={`${categoryKey}`}>
        <InstantSearchSSRProvider {...serverState}>
          <InstantSearch
            {...instantSearchProps}
            routing={{
              router: history({
                getLocation() {
                  if (typeof window === 'undefined') {
                    return new URL(url!) as unknown as Location;
                  }

                  return window.location;
                }
              }),
              stateMapping: {
                stateToRoute(uiState) {
                  return uiState;
                },
                routeToState(routeState) {
                  return routeState;
                }
              }
            }}
          >
            <Configure
              hitsPerPage={hitsPerPageStateHook[0]}
              facets={['*']}
              filters={`categoryKeys:${categoryKey}`}
              distinct={true}
              facetingAfterDistinct={true}
            />
            <>
              <div className={listingPageStyles.widgetAndHitsWrapper}>
                {!pageType?.isGiftCardsCategory && (
                  <div className={listingPageStyles.widgetsDivision}>
                    <CustomDynamicWidgets clpPageData={catProps} fromParentPageType={'PLP'} />
                  </div>
                )}
                <div className={`${listingPageStyles.hitsDivision} ${customHitsGiftClass}`}>
                  <CustomHits
                    clpPageContent={clpPageContent}
                    initialPageLoad={initialPageLoad}
                    resetCSRPageLoad={() => setInitialPageLoad(false)}
                    listName={gtmData.pageType}
                    sessionId={sessionId}
                  />
                  <div ref={paginationElement} className={listingPageStyles.plpPagination}>
                    <CustomPagination searchTerm={getCategoryDetails.metaTitle} />
                  </div>
                </div>
              </div>
              <ProductListFooter
                setShowPlpFiltersDrawer={setShowPlpFiltersDrawer}
                setShowPlpSortBy={setShowPlpSortBy}
                filterCount={plpMobileFilterCount}
              />
              {renderDrawer(showPlpFiltersDrawer, setShowPlpFiltersDrawer)}
              <ProductListSortByDrawer key={`productList${categoryKey}`} />
            </>
          </InstantSearch>
        </InstantSearchSSRProvider>
      </PlpContext.Provider>

      {relatedCategories && cards.length && (
        <div className={listingPageStyles.relatedCategories}>
          <div className={listingPageStyles.relatedCategoriesWrapper}>
            <CategorySlider cards={cards} labels={labels} />
          </div>
        </div>
      )}

      {clpPageContent?.recentlyViewed && clpPageContent?.recentlyViewed.length > 0 && (
        <div className={listingPageStyles.featuredItems}>
          <FeaturedItems
            label="Recently Viewed" //{pdpPageContent.recentlyViewed.label}
            products={clpPageContent?.recentlyViewed}
          />
        </div>
      )}

      {seoContent && (
        <div className={listingPageStyles.seoWrapper}>
          <SeoContent title={seoContent?.title} description={seoContent?.description} />
        </div>
      )}
      <DataLayer pageData={gtmData} />
    </>
  );
}

export { PlpContext };

/*
 * Retrieve & process the HomePage CMS data at runtime on-request.
 */
export async function getServerSideProps(ctx): Promise<GetServerSidePropsResult<any>> {
  const { req, res, query } = ctx;
  const headers = getCookie(ctx);

  const url = constructSsrUrl(req);
  const categoryKey: string = query?.name?.at(-1) ?? '';
  const deliveryKey: string = Array.isArray(query.name) && query.name.join('/');

  const [{ breadCrumbs, clpPageContent }, { getCategoryDetails }] = await Promise.all([
    getListingPageContentAndData(categoryKey, deliveryKey, headers),
    getCategoryDetailsData(categoryKey)
  ]);

  // ASSUMPTION: there are always at least 2 elements in breadCrumbs.links.
  // The category name is always the last element. The department name is always the second to last element.
  const gtmData: CategoryGtmDataLayer = {
    anonymousUserId: getCookieData('hl-anon-id', ctx).toString(),
    category: breadCrumbs.links[breadCrumbs.links.length - 1].label,
    department: breadCrumbs.links[breadCrumbs.links.length - 2].label,
    event: 'page_view',
    email: '',
    pageType: 'productCategory'
  };

  clpPageContent.recentlyViewed = getProductKeysFromCookie({ req });

  const csListPageProps = {
    breadCrumbs,
    categoryKey,
    clpPageContent,
    getCategoryDetails,
    gtmData,
    initialPageLoad: true,
    url
  };

  const serverState = await getServerState(<CategoryListPage {...csListPageProps} />, {
    renderToString
  });

  return {
    props: {
      ...csListPageProps,
      serverState,
      gtmData,
      sessionId: getCookieData('JSESSIONID', { req, res }).toString()
    }
  };
}
