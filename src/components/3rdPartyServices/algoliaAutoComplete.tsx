import { createElement, Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { render } from 'react-dom';
import { useRouter } from 'next/router';

import { InstantSearch, Configure } from 'react-instantsearch-hooks-web';
import type { Render } from '@algolia/autocomplete-js';
import { autocomplete, getAlgoliaResults } from '@algolia/autocomplete-js';

import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import { useHierarchicalMenu } from 'react-instantsearch-hooks';
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches';

import ImageWithFallback from '@Components/common/imageWithFallback';
import { useSelector } from '@Redux/store';
import { getAlgoliaEnvProps, fixForItemPricesWithoutChange } from '@Lib/common/utility';
import { getGiftCardsContent } from '@Lib/cms/plp';
import '@algolia/autocomplete-theme-classic';
import GiftCardPriceComp from '@Components/plp/giftCardPriceComp';
import { Ga4ViewSearchResultsDataLayer } from 'src/interfaces/ga4DataLayer';
import styles from '@Styles/algolia/autoComplete.module.scss';
import SearchIcon from '@mui/icons-material/Search';
import { AuthState } from '@Types/globalState';

const instantSearchProps = getAlgoliaEnvProps('autoComplete');

const INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTES = ['category', 'subcategory', 'department'];

export default function AlgoliaAutoComplete() {
  return (
    <InstantSearch {...instantSearchProps}>
      <Autocomplete
        className={styles.searchContainer}
        searchClient={instantSearchProps?.searchClient}
        placeholder="Search"
        detachedMediaQuery="none"
        openOnFocus={false}
      />
      <Configure hitsPerPage={8} facets={['*']} distinct={true} facetingAfterDistinct={true} />
    </InstantSearch>
  );
}

const getEncodedUri = (item) => {
  const { query, subCat } = item;
  const cfg = `${instantSearchProps?.indexName}[configure]`;
  const subCategoryParam = `${instantSearchProps?.indexName}[refinementList][subcategory][0]`;

  let searchQuery = `${cfg}[hitsPerPage]=12&${cfg}[facets][0]=*&${cfg}[distinct]=false&${cfg}[facetingAfterDistinct]=false&${cfg}[typoTolerance]=false&`;
  searchQuery += `${instantSearchProps?.indexName}[page]=1&${cfg}[query]=${query}`;

  if (subCat) {
    searchQuery += `&${subCategoryParam}=${subCat?.replace('&', '%26')}`;
  }
  return encodeURI(searchQuery)?.replace('%2526', '%26');
};

export function Autocomplete({ searchClient, className, ...autocompleteProps }: any) {
  const { myProfileInfo } = useSelector((state: { auth: AuthState }) => state.auth) ?? {};
  const { pageType } = useSelector((state) => state.layout) ?? {};
  const autocompleteContainer = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const { items: categories, refine: setCategory } = useHierarchicalMenu({
    attributes: INSTANT_SEARCH_HIERARCHICAL_ATTRIBUTES
  });
  const {
    heartBeatInfo: { isLoggedInUser, sessionId }
  } = useSelector((state) => state.auth) ?? {};

  const [gcPurchaseRange, setGcPurchaseRange] = useState({
    minPurchaseAmount: '',
    maxPurchaseAmount: ''
  });

  useEffect(() => {
    async function getGiftCardsCmsData() {
      const giftCardData = await getGiftCardsContent();
      setGcPurchaseRange(giftCardData);
    }
    getGiftCardsCmsData();
  }, []);

  const currentCategory = useMemo(
    () => categories.find(({ isRefined }) => isRefined)?.value,
    [categories]
  );

  const debouncePromise = (fn, time) => {
    let timerId = undefined;

    return function debounced(...args) {
      if (timerId) {
        clearTimeout(timerId);
      }

      return new Promise((resolve) => {
        timerId = setTimeout(() => resolve(fn(...args)), time);
      });
    };
  };

  const debounced = debouncePromise((items) => Promise.resolve(items), 200);

  const plugins = useMemo(() => {
    const recentSearches = createLocalStorageRecentSearchesPlugin({
      key: 'instantsearch',
      limit: 10,
      transformSource({ source }) {
        return {
          ...source,
          onSelect({ item }: any) {
            router.push(`/search?text=${item.query}`);
          },
          noResults() {
            return 'No matching items.';
          }
        };
      }
    });

    const querySuggestions = createQuerySuggestionsPlugin({
      searchClient,
      indexName:
        process.env.NEXT_PUBLIC_ALGOLIA_QUERY_SUGGESTIONS_INDEX_NAME ||
        'HLNextGenEcommIndex_snd_query_suggestions',
      getSearchParams() {
        return recentSearches.data.getAlgoliaSearchParams({
          hitsPerPage: 5
        });
      },
      categoryAttribute: [instantSearchProps?.indexName, 'facets', 'exact_matches', 'subcategory'],
      itemsWithCategories: 1,
      categoriesPerItem: 3,
      transformSource({ source }) {
        return {
          ...source,
          sourceId: 'querySuggestionsPlugin',
          onSelect({ item }) {
            const subCat = item?.['__autocomplete_qsCategory'];
            const searchQuery = getEncodedUri({ query: item?.query, subCat });
            window.location.href = `/search?${searchQuery}`;
          },
          getItems(params) {
            if (!params.state.query) {
              return [];
            }
            return source.getItems(params);
          },
          templates: {
            ...source.templates
          }
        };
      }
    });

    return [querySuggestions];
  }, [currentCategory]);

  useEffect(() => {
    if (!autocompleteContainer.current) {
      return;
    }

    const autocompleteInstance = autocomplete({
      ...autocompleteProps,
      container: autocompleteContainer.current,
      insights: true,
      plugins,
      renderer: { createElement, Fragment, render: render as unknown as Render },
      classNames: {
        form: styles.searchForm,
        inputWrapperPrefix: styles.searchPrefix,
        submitButton: styles.searchButtonHidden,
        loadingIndicator: styles.searchButtonHidden
      },
      getSources({ query }) {
        return debounced([
          {
            sourceId: 'items',
            getItems() {
              return getAlgoliaResults({
                searchClient,
                queries: [
                  {
                    indexName: instantSearchProps?.indexName,
                    query,
                    params: {
                      hitsPerPage: 4
                    }
                  }
                ]
              });
            },
            templates: {
              header() {
                return <strong>You might like</strong>;
              },
              item({ item, components }: any) {
                const getPriceSection = () => {
                  if (item === null) {
                    console.error('No item found');
                    return <span></span>;
                  }
                  const isGiftCardSku = item?.sku?.indexOf('gc-') !== -1;

                  if (isGiftCardSku) {
                    return (
                      <GiftCardPriceComp
                        isGiftCardSku
                        gcPurchaseRange={gcPurchaseRange}
                        isGcPriceFromAutoComplete
                      />
                    );
                  }
                  const originalPrice = fixForItemPricesWithoutChange(item['variant.price']);

                  let discountPrice =
                    fixForItemPricesWithoutChange(item['sku.discountedPrice']) || originalPrice;

                  if (discountPrice === '$0.00') {
                    discountPrice = originalPrice;
                  }

                  if (discountPrice === originalPrice) {
                    return <span className="aa-DiscountPrice">{originalPrice}</span>;
                  }

                  return (
                    <>
                      {discountPrice && <span className="aa-DiscountPrice">{discountPrice}</span>}
                      <span className="aa-RegularPrice">{originalPrice}</span>
                    </>
                  );
                };

                return (
                  <a href={item?.variantUrl}>
                    <div className="aa-ItemWrapper">
                      <div className="aa-ItemContent" style={{ minWidth: 250 }}>
                        <div className="aa-ItemContentBody">
                          <div
                            className="aa-ItemContentTitle"
                            style={{ display: 'flex', flexDirection: 'row' }}
                          >
                            <ImageWithFallback
                              src={`${item?.images?.[0]?.url}?w=100&h=100`}
                              width={100}
                              height={100}
                              layout="responsive"
                              key={item?.images?.[0]?.url}
                            />
                            <div style={{ height: 50, paddingTop: 0, paddingLeft: 10 }}>
                              <span>
                                <components.Highlight hit={item} attribute="name" />
                              </span>
                              <div className="aa-PriceSection">{getPriceSection()}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                );
              },
              footer() {
                const searchQuery = getEncodedUri({ query });

                function handleViewSearchResultsEvent(): void {
                  if (window) {
                    const gtmData: Ga4ViewSearchResultsDataLayer = {
                      email: '',
                      anonymous_user_id: '',
                      event: 'view_all_search_results',
                      user_id: '',
                      search_term: query ? query : ''
                    };

                    if (myProfileInfo && myProfileInfo.email) {
                      gtmData.email = myProfileInfo.email;
                    }

                    if (sessionId) {
                      isLoggedInUser
                        ? (gtmData.user_id = sessionId)
                        : (gtmData.anonymous_user_id = sessionId);
                    }
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push(gtmData);
                  }
                }
                return (
                  <a
                    href={query ? `/search?${searchQuery}` : '#'}
                    onClick={handleViewSearchResultsEvent}
                  >
                    <div className="aa-FooterSection">
                      <strong className="aa-FooterSeeMore">See More</strong>
                    </div>
                  </a>
                );
              },
              noResults() {
                return 'No matching items.';
              }
            }
          }
        ]);
      }
    });

    return () => autocompleteInstance.destroy();
  }, [plugins, gcPurchaseRange]);

  return (
    <div
      className={className}
      ref={autocompleteContainer}
      onKeyDown={({ keyCode, target }) => {
        const searchKey = target?.['value'];
        const searchQuery = getEncodedUri({ query: searchKey });

        if (keyCode === 13 && searchKey) {
          const searchUrl = `/search?${searchQuery}`;
          if (pageType?.isSrpPage) {
            window.location.href = searchUrl;
          } else {
            window.location.href = searchUrl;
          }
        }
      }}
    >
      <button
        className={styles.searchButton}
        onClick={() => {
          const searchInput: HTMLInputElement = document.querySelector('.aa-Input');

          if (searchInput && searchInput.value) {
            const searchQuery: string = getEncodedUri({ query: searchInput.value });
            const searchUrl: string = `/search?${searchQuery}`;
            window.location.href = searchUrl;
          }
        }}
      >
        <SearchIcon />
      </button>
    </div>
  );
}
