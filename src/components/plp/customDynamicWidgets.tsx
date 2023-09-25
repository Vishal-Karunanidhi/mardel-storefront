import { useEffect, useMemo, useContext } from 'react';
import {
  DIY_FACET,
  DEFAULT_FACETS,
  FACETS_TO_EXCLUDE_CAT,
  FACETS_TO_EXCLUDE_SUB_CAT,
  FACETS_TO_EXCLUDE_STOCK,
  pageBasedToggleFacets
} from '@Constants/categoryConstants';
import connectStats from 'instantsearch.js/es/connectors/stats/connectStats';
import {
  useHits,
  RefinementList,
  ToggleRefinement,
  useConnector
} from 'react-instantsearch-hooks-web';
import Panel from './Panel';
import CustomRefinementList from './customRefinementList';
import WidgetStyles from '@Styles/plp/categoryListingPages.module.scss';
import { isSubCategory, getAlgoliaIndexName } from '@Lib/common/utility';
import { FiltersContext } from '@Components/layout';

const RenderDefaultRefinementList = () => (
  <>
    {DEFAULT_FACETS.map((e, i) => (
      <>
        <Panel>{e.isToggle ? <ToggleRefinement {...e} /> : <RefinementList {...e} />}</Panel>
        {i !== DEFAULT_FACETS.length && <RenderDivider />}
      </>
    ))}
  </>
);

export const RenderDivider = (props) => <hr className={WidgetStyles.filterDivider} {...props} />;

const RenderTitleSection = ({ filterLabel, resultsLabel }) => {
  const { nbHits } = useConnector(connectStats);
  return (
    <span className={WidgetStyles.filterSection}>
      <label className={WidgetStyles.filterLabel}>{filterLabel ?? 'Filters'}</label>
    </span>
  );
};

export default function CustomDynamicWidgets({
  clpPageData,
  fromParentPageType = 'PLP',
  isSrpPage = false
}): any {
  const indexName = getAlgoliaIndexName(fromParentPageType);

  const { clpPageContent, serverState, categoryKey } = clpPageData;
  let { results } = serverState?.initialResults?.[indexName] ?? {};
  if (!results) {
    const { results: hitResults } = useHits();
    results = [hitResults];
  }
  const { order } = results?.[0]?.renderingContent?.facetOrdering?.facets ?? {};
  const isSubCat = isSubCategory(categoryKey);
  const { setPlpMobileFilterCount } = useContext(FiltersContext);
  const { nbHits } = useConnector(connectStats);

  let facetFilters: any = <></>;

  useEffect(() => {
    setPlpMobileFilterCount(nbHits);
  }, [nbHits]);

  useMemo(() => {
    if (!order?.length) {
      facetFilters = <RenderDefaultRefinementList />;
    }
  }, [order]);

  /* Moving the In Stock & On Sale toggle facet filters to the top, if not
      and remove the facets to exclude for cat & sub-cat page and toggle facets */
  order?.forEach((attribute, index, object) => {
    const TEMP_FACETS = pageBasedToggleFacets[fromParentPageType];
    if (TEMP_FACETS.includes(attribute)) {
      const toggleAttribute = object.splice(index, 1)[0];
      object.splice(TEMP_FACETS.indexOf(attribute), 0, toggleAttribute);
    } else if (
      (!isSubCat && FACETS_TO_EXCLUDE_CAT.includes(attribute)) ||
      (isSubCat && FACETS_TO_EXCLUDE_SUB_CAT.includes(attribute)) ||
      FACETS_TO_EXCLUDE_STOCK.includes(attribute)
    ) {
      object.splice(index, 1);
    }
  });

  if (order?.length) {
    facetFilters = order.map((name: string, index: number) => (
      <CustomRefinementList
        key={index}
        attribute={name}
        isLastAttribute={index === order.length - 1}
        fromParentPageType={fromParentPageType}
      />
    ));
  }

  return (
    <div className={WidgetStyles.dynamicWidgetWrapper}>
      <RenderTitleSection {...clpPageContent} />
      <RenderDivider className={WidgetStyles.titleDivider} />
      {facetFilters}
    </div>
  );
}

export const DiyWidgetsForSearch = ({ clpPageData, fromParentPageType }) => {
  const { clpPageContent } = clpPageData;

  const { setDiyMobileFilterCount } = useContext(FiltersContext);
  const { nbHits } = useConnector(connectStats);
  let facetFilters: any = <></>;

  useEffect(() => {
    setDiyMobileFilterCount(nbHits);
  }, [nbHits]);

  return (
    <div className={WidgetStyles.dynamicWidgetWrapper}>
      <RenderTitleSection {...clpPageContent} />
      <RenderDivider className={WidgetStyles.titleDivider} />
      {DIY_FACET?.map(({ attribute }, index) => (
        <CustomRefinementList
          key={index}
          attribute={attribute}
          fromParentPageType={fromParentPageType}
          isLastAttribute={index === DIY_FACET.length - 1}
        />
      ))}
    </div>
  );
};
