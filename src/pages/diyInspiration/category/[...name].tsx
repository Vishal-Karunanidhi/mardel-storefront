import {
  useState,
  createContext,
  Dispatch,
  SetStateAction,
  useRef,
  useContext,
  Fragment
} from 'react';
import { renderToString } from 'react-dom/server';
import { useRouter } from 'next/router';
import { GetServerSidePropsResult } from 'next/types';
import { getServerState } from 'react-instantsearch-hooks-server';
import { history } from 'instantsearch.js/es/lib/routers/index.js';
import { InstantSearch, Configure, InstantSearchSSRProvider } from 'react-instantsearch-hooks-web';

import CategorySlider from '@Components/landingPage/department/components/categorySlider';
import { DiyWidgetsForSearch } from '@Components/plp/customDynamicWidgets';
import ProjectCarousel from '@Components/homepage/projectCarousel';
import CustomPagination from '@Components/plp/customPagination';
import Breadcrumb from '@Components/breadcrumb/breadcrumb';
import CustomHits from '@Components/plp/customHits';
import Image from 'next/image';
import { useSelector } from '@Redux/store';
import { getCategoryPage } from '@Lib/cms/diyInspiration';
import { getAlgoliaEnvProps, contentToBreadcrumb, constructSsrUrl } from '@Lib/common/utility';
import { defaultHomeBCrumbs } from '@Constants/generalConstants';
import listingPageStyles from '@Styles/plp/categoryListingPages.module.scss';
import { Drawer, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FiltersContext } from '@Components/layout';
import ProductListSortByDrawer from '@Components/productDetailPage/productListSortByDrawer';
import DiyListSortByDrawer from '@Components/diyDetails/diyListSortByDrawer';
import DiyListFooter from '@Components/diyDetails/diyListFooter';

const instantSearchProps = getAlgoliaEnvProps('DIY');
const PlpContext = createContext<[number, Dispatch<SetStateAction<number>>]>(undefined);

export default function DiyCategory(catProps): JSX.Element {
  const { query } = useRouter() ?? {};
  const paginationElement = useRef(null);
  const hitsPerPageStateHook = useState(12);
  const { pageType } = useSelector((state) => state.layout) ?? {};
  const [initialPageLoad, setInitialPageLoad] = useState(catProps.initialPageLoad);
  const { parentDeliveryKey, diyCatPageContents, url } = catProps;
  const { searchParam, isFromSearchPage = false } = catProps;
  const { showDiyFilterDrawer, setShowDiyFiltersDrawer, setShowDiySortBy, diyMobileFilterCount } =
    useContext(FiltersContext);

  const renderDrawer = (showDiyFilterDrawer, setShowDiyFiltersDrawer) => {
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
        open={showDiyFilterDrawer}
        onClose={() => setShowDiyFiltersDrawer(false)}
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
              onClick={() => setShowDiyFiltersDrawer(false)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          </div>
        </div>
        <DiyWidgetsForSearch clpPageData={catProps} fromParentPageType={'DIY'} />
      </Drawer>
    );
  };

  const customHitsGiftClass = pageType?.isGiftCardsCategory
    ? listingPageStyles.giftCardsHitsDivision
    : '';

  const breadCrumbs = {
    links: [
      defaultHomeBCrumbs,
      {
        key: 'DIY Inspiration',
        label: 'DIY Inspiration',
        value: '/DIY-Projects-Videos/c/13',
        openInNewTab: false
      },
      {
        key: query?.name?.at(-3),
        label: query?.name?.at(-3),
        value: 'null',
        openInNewTab: false
      }
    ]
  };

  let configureQuery: any = {
    filters: `parentDeliveryKey:${parentDeliveryKey}`,
    distinct: true,
    facetingAfterDistinct: true
  };
  if (isFromSearchPage) {
    configureQuery = {
      query: searchParam,
      distinct: false,
      facetingAfterDistinct: false
    };
  }
  return (
    <Fragment key={parentDeliveryKey}>
      {!isFromSearchPage && <Breadcrumb breadCrumbs={contentToBreadcrumb(breadCrumbs)} />}

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
        <Configure facets={['*']} hitsPerPage={hitsPerPageStateHook[0]} {...configureQuery} />
        <>
          <div className={listingPageStyles.widgetAndHitsWrapper}>
            <div className={listingPageStyles.widgetsDivision}>
              <DiyWidgetsForSearch clpPageData={catProps} fromParentPageType={'DIY'} />
            </div>
            <div className={`${listingPageStyles.hitsDivision} ${customHitsGiftClass}`}>
              <div style={{ padding: 25 }}>
                {diyCatPageContents?.imLookingFor && (
                  <CategorySlider
                    cards={diyCatPageContents?.imLookingFor}
                    labels={{ categoryCarousel: "I'm Looking For" }}
                  />
                )}
              </div>
              <CustomHits
                clpPageContent={{}}
                initialPageLoad={initialPageLoad}
                resetCSRPageLoad={() => setInitialPageLoad(false)}
                fromParentPageType={'DIY'}
                listName={diyCatPageContents?.title}
              />
              <div ref={paginationElement} className={listingPageStyles.plpPagination}>
                <CustomPagination searchTerm={diyCatPageContents?.title} />
              </div>
            </div>
          </div>
          {diyCatPageContents?.youMayAlsoLike && (
            <ProjectCarousel
              label="You May Also Like"
              productDetails={diyCatPageContents?.youMayAlsoLike}
              showViewAll={false}
            />
          )}
          <>
            <DiyListFooter
              setShowDiyFiltersDrawer={setShowDiyFiltersDrawer}
              setShowDiySortBy={setShowDiySortBy}
              filterCount={diyMobileFilterCount}
            />
            {renderDrawer(showDiyFilterDrawer, setShowDiyFiltersDrawer)}
            <DiyListSortByDrawer />
          </>
        </>
      </InstantSearch>
    </Fragment>
  );
}

export const DiyCategorySsr = (catProps) => {
  const hitsPerPageStateHook = useState(12);

  return (
    <PlpContext.Provider value={hitsPerPageStateHook} key={catProps?.parentDeliveryKey}>
      <InstantSearchSSRProvider {...catProps?.serverState}>
        <DiyCategory {...catProps} />
      </InstantSearchSSRProvider>
    </PlpContext.Provider>
  );
};

export async function getServerSideProps({ req, query }): Promise<GetServerSidePropsResult<any>> {
  const url = constructSsrUrl(req);
  const parentDeliveryKey = query?.name?.join('/');
  const diyCatPageContents = await getCategoryPage(parentDeliveryKey);

  const csListPageProps = {
    diyCatPageContents,
    parentDeliveryKey,
    initialPageLoad: true,
    url
  };

  const serverState = await getServerState(<DiyCategorySsr {...csListPageProps} />, {
    renderToString
  });

  return {
    props: {
      ...csListPageProps,
      serverState
    }
  };
}
