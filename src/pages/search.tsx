import {
  useState,
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef
} from 'react';
import Head from 'next/head';
import { renderToString } from 'react-dom/server';

import { GetServerSidePropsResult } from 'next/types';
import { history } from 'instantsearch.js/es/lib/routers/index.js';
import { InstantSearch, Configure, InstantSearchSSRProvider } from 'react-instantsearch-hooks-web';
import { getServerState } from 'react-instantsearch-hooks-server';

import DiyCategoryPage from '@Pages/diyInspiration/category/[...name]';

import { Drawer, IconButton } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CloseIcon from '@mui/icons-material/Close';

import { FiltersContext } from '@Components/layout';
import CustomHits from '@Components/plp/customHits';
import Breadcrumb from '@Components/breadcrumb/breadcrumb';
import CustomPagination from '@Components/plp/customPagination';
import CustomDynamicWidgets from '@Components/plp/customDynamicWidgets';
import ProductListSortByDrawer from '@Components/productDetailPage/productListSortByDrawer';
import DataLayer from '@Utils/DataLayer';

import {
  constructSsrUrl,
  getAlgoliaEnvProps,
  constructSsrOrigin,
  extractSearchQuery,
  getAlgoliaIndexName
} from '@Lib/common/utility';

import listingPageStyles from '@Styles/plp/categoryListingPages.module.scss';
import { SearchGtmDataLayer } from 'src/interfaces/gtmDataLayer';
import { getCookieData } from '@Lib/common/serverUtility';
import ProductListFooter from '@Components/productDetailPage/productListFooter';

const instantSearchProps = getAlgoliaEnvProps();
const PlpContext = createContext<[number, Dispatch<SetStateAction<number>>]>(undefined);

const EmptySearchResults = ({ searchParam = '' }) => {
  const addedMessage = searchParam ? `for "${searchParam}"` : '';
  return (
    <>
      <Head>
        <title>No Results | Hobby Lobby</title>
      </Head>
      <section className={listingPageStyles.emptyBook}>
        {searchParam && (
          <>
            <h3 className={listingPageStyles.emptyBookTitle}>Oops! No matches {addedMessage}</h3>
            <p>Check the spelling or try using different words.</p>
          </>
        )}
        {!searchParam && (
          <h3 className={listingPageStyles.emptyBookTitle}>Products coming soon!</h3>
        )}
      </section>
    </>
  );
};

/*Run time Execution*/
export function CategoryListPage(catProps: any) {
  const [initialPageLoad, setInitialPageLoad] = useState(catProps.initialPageLoad);

  const { serverState, url, searchParam, filter, sessionId } = catProps;

  const generalFilter = filter ?? '';

  let defaultHitsPerPage = 12;
  const hitsPerPageStateHook = useState(defaultHitsPerPage);
  const {
    showPlpFiltersDrawer,
    setShowPlpFiltersDrawer,
    setShowPlpStickyFooter,
    plpMobileFilterCount,
    setShowPlpSortBy,
    diyMobileFilterCount
  } = useContext(FiltersContext);
  const paginationElement = useRef(null);

  useEffect(() => {
    document.addEventListener('scroll', handleShowPlpStickyFooter);
    return () => {
      document.removeEventListener('scroll', handleShowPlpStickyFooter);
    };
  }, []);

  const handleShowPlpStickyFooter = () => {
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
              <img alt="Filters Icon" src={'icons/filtersIcon.svg'} height="24" width="24" />
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
        <CustomDynamicWidgets clpPageData={catProps} isSrpPage={true} fromParentPageType={'SRP'} />
      </Drawer>
    );
  };

  return (
    <>
      <PlpContext.Provider value={hitsPerPageStateHook}>
        <InstantSearchSSRProvider {...serverState}>
          <InstantSearch
            {...instantSearchProps}
            key={`${searchParam}`}
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
              distinct={false}
              facetingAfterDistinct={false}
              typoTolerance={false}
              query={searchParam}
              clickAnalytics={true}
              filters={generalFilter !== '' ? generalFilter : ''}
            />
            {plpMobileFilterCount == 0 && <EmptySearchResults searchParam={searchParam} />}
            {plpMobileFilterCount != 0 && (
              <>
                <div className={listingPageStyles.widgetAndHitsWrapper}>
                  <div className={listingPageStyles.widgetsDivision}>
                    {plpMobileFilterCount > 0 && (
                      <CustomDynamicWidgets
                        clpPageData={catProps}
                        isSrpPage={true}
                        fromParentPageType={'SRP'}
                      />
                    )}
                  </div>
                  <div className={listingPageStyles.hitsDivision}>
                    <CustomHits
                      clpPageContent={{}}
                      initialPageLoad={initialPageLoad}
                      resetCSRPageLoad={() => setInitialPageLoad(false)}
                      listName={'search results page'}
                      sessionId={sessionId}
                    />
                    <div ref={paginationElement} className={listingPageStyles.plpPagination}>
                      <CustomPagination searchTerm={searchParam} />
                    </div>
                  </div>
                </div>
                <>
                  <ProductListFooter
                    setShowPlpFiltersDrawer={setShowPlpFiltersDrawer}
                    setShowPlpSortBy={setShowPlpSortBy}
                    filterCount={plpMobileFilterCount}
                  />
                  {renderDrawer(showPlpFiltersDrawer, setShowPlpFiltersDrawer)}
                  <ProductListSortByDrawer />
                </>
              </>
            )}
          </InstantSearch>
        </InstantSearchSSRProvider>
      </PlpContext.Provider>
      <DataLayer pageData={catProps.gtmData} />
    </>
  );
}

export default function ConsolidatedSearchBar(catProps) {
  const { searchParam, breadCrumbData } = catProps;
  const { plpMobileFilterCount } = useContext(FiltersContext);
  const { diyMobileFilterCount } = useContext(FiltersContext);
  const [isProducts, setIsProducts] = useState(true);

  const handleTabChange = () => setIsProducts(!isProducts);
  const renderMobileFilterCounts = isProducts ? plpMobileFilterCount : diyMobileFilterCount;
  return (
    <>
      <Breadcrumb
        breadCrumbs={breadCrumbData}
        optionalHeader={
          <>
            Results for "{searchParam}" <label>({renderMobileFilterCounts})</label>
          </>
        }
      />
      <div className={listingPageStyles.container}>
        <section className={listingPageStyles.filterWrapper}>
          <Tabs
            value={isProducts ? 0 : 1}
            onChange={handleTabChange}
            aria-label="Search filter Tab"
          >
            <Tab label={'Products'} />
            <Tab label={'Projects'} />
          </Tabs>
        </section>
      </div>

      {isProducts ? (
        <CategoryListPage {...catProps} />
      ) : (
        <DiyCategoryPage {...catProps} isFromSearchPage />
      )}
    </>
  );
}

export { PlpContext };

/*
 * Retrieve & process the HomePage CMS data at runtime on-request.
 */
export async function getServerSideProps({
  req,
  res,
  query
}): Promise<GetServerSidePropsResult<any>> {
  const searchParam = query?.text ?? extractSearchQuery(query);
  const filter: string = query?.filter ?? null;
  const url = constructSsrUrl(req);
  const origin = constructSsrOrigin(req);

  const breadCrumbData = [
    {
      key: origin,
      name: 'Home',
      openInNewTab: false,
      slug: '/'
    },
    {
      key: origin,
      name: 'Search Results',
      openInNewTab: false,
      slug: origin
    }
  ];

  const csListPageProps = {
    url,
    searchParam,
    filter,
    initialPageLoad: true,
    breadCrumbData
  };

  const serverState = await getServerState(<ConsolidatedSearchBar {...csListPageProps} />, {
    renderToString
  });

  const indexName = getAlgoliaIndexName();
  const results = serverState?.initialResults?.[indexName]?.results?.[0];
  if (results?.['nbHits'] === 1) {
    const hits = results?.['hits'];
    const absoluteProductMatch =
      hits.length === 1 ? hits?.[0] : hits?.find((e) => e?.sku === searchParam);

    if (absoluteProductMatch && Object.keys(absoluteProductMatch)) {
      res.setHeader('location', hits?.[0]?.variantUrl);
      res.statusCode = 302;
      res.end();
      return {
        props: {}
      };
    }
  }

  // TODO: datalayer shouldn't be pushed if `results` are invalid
  const gtmData: SearchGtmDataLayer = {
    anonymousUserId: getCookieData('hl-anon-id', { req, res }).toString(),
    event: 'page_view',
    numResults: results?.['nbHits'],
    pageType: 'search',
    searchKeywords: results?.['query']
  };

  return {
    props: {
      ...csListPageProps,
      serverState,
      gtmData,
      sessionId: getCookieData('JSESSIONID', { req, res }).toString()
    }
  };
}

export { EmptySearchResults };
