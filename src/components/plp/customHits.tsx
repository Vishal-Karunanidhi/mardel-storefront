import { ProjectProductCard } from '@Components/homepage/projectCarousel';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Markdown } from 'react-showdown';
import {
  useHits,
  CurrentRefinements,
  useSortBy,
  useCurrentRefinements,
  usePagination
} from 'react-instantsearch-hooks-web';

import Button from '@mui/material/Button';
import { useSelector } from '@Redux/store';

import ProductCard from './productCard';
import {
  algoliaProductsToGtmItems,
  formatCategoryCarousel,
  handleProductViewListEvent
} from '@Lib/common/utility';
import SecondaryPromotion from '@Components/homepage/secondaryPromotion';
import CategorySlider from '@Components/landingPage/department/components/categorySlider';
import { EmptySearchResults } from '@Pages/search';
import {
  TOGGLE_FACETS,
  SEARCH_TOGGLE_FACETS,
  DIY_TOGGLE_FACETS,
  SORT_BY
} from '@Constants/categoryConstants';
import CardStyles from '@Styles/components/slider/cards/featuredItemCard.module.scss';
import CatStyles from '@Styles/plp/categoryListingPages.module.scss';
import HLSelect from '@Components/common/hlSelect';
import { useDispatch } from '@Redux/store';
import DIYSortDropdown from '@Components/diyDetails/DIYSortDropdown';
import { Ga4SearchSortDataLayer } from 'src/interfaces/ga4DataLayer';
import { Ga4EcommerceItem } from 'src/interfaces/ga4EcommerceItem';

const HitCard = ({ hit, isMobile, fromParentPageType, listName }) => {
  const { pageType } = useSelector((state) => state.layout) ?? {};

  if (pageType?.isDiyCategoryPage || fromParentPageType === 'DIY') {
    return (
      <ProjectProductCard
        {...hit}
        projectCard={{
          ...hit,
          thumbnail: {
            image: { url: `https://${hit?.thumbnail}` },
            imageAltText: hit?.thumbnailAltText
          }
        }}
      />
    );
  }

  return (
    <ProductCard key={hit?.objectID} isMobile={isMobile} productData={hit} listName={listName} />
  );
};

type Props = {
  clpPageContent?: any;
  initialPageLoad?: any;
  resetCSRPageLoad?: any;
  fromParentPageType?: string;
  optionalCustomHitsHeader?: JSX.Element;
  listName: string;
  sessionId?: string;
};

const mobile: number = 1024;
export default function CustomHits({
  clpPageContent = {},
  initialPageLoad = null,
  resetCSRPageLoad = null,
  fromParentPageType = '',
  optionalCustomHitsHeader = null,
  listName,
  sessionId = ''
}: Props): any {
  const dispatch = useDispatch();
  const { pageType } = useSelector((state) => state.layout) ?? {};
  const { heartBeatInfo } = useSelector((state) => state.auth) ?? {};
  const { hits, results } = useHits();
  const { currentRefinement: currPage } = usePagination();
  const { items: facetFilterItems } = useCurrentRefinements();

  const [sortByItem, setSortByItem] = useState(SORT_BY.items);
  const { refine, options, currentRefinement } = useSortBy({ items: sortByItem });
  useEffect(() => {
    if (pageType?.isGiftCardsCategory) {
      const SORT_BY_ITEM = SORT_BY.items.filter((e) => e.label.indexOf('Price') === -1);
      setSortByItem(SORT_BY_ITEM);
    }
  }, [pageType?.isGiftCardsCategory]);

  const [isMobile, setIsMobile] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [screenWidth, setScreenWidth] = useState<number>(0);

  const { subCategories, promos } = clpPageContent;
  const { cards, labels } = formatCategoryCarousel(subCategories);

  /*Use during Responsive Fixes*/
  useEffect(() => setIsMobile(windowWidth < mobile || screenWidth < mobile), [windowWidth]);
  useEffect(() => {
    window.addEventListener('resize', captureWindowAndScreenWidth);
    captureWindowAndScreenWidth();
  }, []);
  function captureWindowAndScreenWidth() {
    setWindowWidth(window.innerWidth);
    setScreenWidth(window.screen.width);
  }

  const sortSelectionData = options?.map(({ label, value }) => ({ code: value, name: label }));

  let hitTiles = hits?.map((e, index) => (
    <HitCard
      hit={e}
      isMobile={isMobile}
      key={index}
      fromParentPageType={fromParentPageType}
      listName={listName}
    />
  ));

  const totalChoosenFilters = facetFilterItems.flatMap((e) => e.refinements);
  useEffect(() => {
    if (!initialPageLoad) {
      if (typeof document !== 'undefined') {
        const element = document?.getElementById('current_refinement_sort');
        if (element) {
          element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    } else {
      resetCSRPageLoad();
    }
  }, [totalChoosenFilters.length, currPage, currentRefinement]);

  (() => {
    const { enableAdTile, adTile } = clpPageContent;
    if (enableAdTile && (adTile?.pageNumber ?? 1) - 1 === results?.page) {
      const { discountInfo, link, media, tilePosition, imageAltText } = clpPageContent?.adTile;
      const tileComponent = (
        <li className="ais-Hits-item">
          <Link href={link} passHref>
            <a>
              <div className={`${CardStyles.card} ${CatStyles.adTile}`}>
                <img alt={imageAltText} src={media?.image?.url} />
                <div className={CatStyles.content}>
                  <Markdown markdown={discountInfo} />
                  <Button
                    size="small"
                    className={CatStyles.rightArrow}
                    disableRipple
                    onClick={() => window.open(link, '_self')}
                  >
                    <img
                      src={'/icons/rightArrow.svg'}
                      alt="Picture of the author"
                      width="37"
                      height="15"
                      className={CatStyles.rightArrowImage}
                    />
                  </Button>
                </div>
              </div>
            </a>
          </Link>
        </li>
      );
      hitTiles.splice(tilePosition - 1, 0, tileComponent);
    }
  })();

  useEffect(() => {
    if (window) {
      const items: Ga4EcommerceItem[] = algoliaProductsToGtmItems(hitTiles);
      if (items.length > 0) {
        handleProductViewListEvent(
          items,
          listName,
          heartBeatInfo?.sessionId || sessionId,
          heartBeatInfo?.isLoggedInUser || false
        );
      }
    }
  }, []);

  function handleSearchSortEvent(sortLabel: string): void {
    if (window) {
      const gtmData: Ga4SearchSortDataLayer = {
        anonymous_user_id: '',
        event: 'search_sort',
        sort_label: sortLabel,
        user_id: ''
      };

      if (sessionId) {
        heartBeatInfo.isLoggedInUser
          ? (gtmData.user_id = sessionId)
          : (gtmData.anonymous_user_id = sessionId);
      }
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(gtmData);
    }
  }

  return (
    <div className={CatStyles.customHits}>
      {subCategories && (
        <div className={CatStyles.imlookingFor}>
          <CategorySlider cards={cards} labels={labels} />
        </div>
      )}
      {promos?.media && (
        <div className={CatStyles.promos}>
          <SecondaryPromotion
            Promos={[promos]}
            style={{ marginLeft: 0, marginRight: 0, marginTop: 40, padding: 0 }}
            gridStyle={{ margin: 0, padding: 0 }}
          />
        </div>
      )}
      {optionalCustomHitsHeader && optionalCustomHitsHeader}
      <div id="current_refinement_sort"></div>
      {hits.length > 0 && (
        <div className={CatStyles.currRefineAndSortBy}>
          <CurrentRefinements
            excludedAttributes={TOGGLE_FACETS.concat(SEARCH_TOGGLE_FACETS).concat(
              DIY_TOGGLE_FACETS
            )}
          />
          {!pageType?.isDiyCategoryPage && fromParentPageType !== 'DIY' && (
            <HLSelect
              selectBoxData={sortSelectionData}
              selectBoxValue={currentRefinement}
              handleSelectOnChange={(event) => {
                const sortLabel = event?.target?.value;
                const selectedSortData = sortSelectionData.find(
                  (sortData) => sortData.code === sortLabel
                );
                dispatch({
                  type: 'UPDATE_CURRENT_SORT_REFINEMENT',
                  payload: sortLabel
                });
                handleSearchSortEvent(selectedSortData.name);
                refine(sortLabel);
              }}
            />
          )}
          {fromParentPageType === 'DIY' && (
            <DIYSortDropdown
              initialPageLoad={initialPageLoad}
              resetCSRPageLoad={resetCSRPageLoad}
            />
          )}
        </div>
      )}

      {/* <div className="ais-Hits_">
        <ol className="ais-Hits-list_">{hitTiles}</ol>
      </div> */}
      {!hitTiles?.length && (
        <span className={CatStyles.noResultPage}>
          <EmptySearchResults />
        </span>
      )}
      <div className={CatStyles.customProdCard}>{hitTiles}</div>
    </div>
  );
}
