import { RefinementList, ToggleRefinement, useRefinementList } from 'react-instantsearch-hooks-web';
import Panel from './Panel';
import {
  limit,
  showMore,
  FACETS_TITLE_MAP,
  pageBasedToggleFacets
} from '@Constants/categoryConstants';
import WidgetStyles from '@Styles/plp/categoryListingPages.module.scss';
import { Ga4SearchFilterDataLayer } from 'src/interfaces/ga4DataLayer';
import { SyntheticEvent } from 'react';
import styles from '@Styles/algolia/customRefinementList.module.scss';
import { useSelector } from '@Redux/store';

export default function CustomRefinementList({ attribute, isLastAttribute, fromParentPageType }) {
  const { items } = useRefinementList({ attribute });

  const isToggleFacet: boolean = pageBasedToggleFacets[fromParentPageType]?.includes(attribute);
  const canRenderRefinementList: boolean = isToggleFacet || !!items?.length;
  const { heartBeatInfo } = useSelector((state) => state.auth) ?? {};

  let toggleFacetLabel: any;
  if (isToggleFacet) {
    toggleFacetLabel = `${FACETS_TITLE_MAP[attribute]}`;
  }

  function handleSearchInteractionEvent(
    filterName: string,
    filterType: string | boolean,
    isChecked: boolean
  ): void {
    if (window && filterType !== undefined) {
      const gtmData: Ga4SearchFilterDataLayer = {
        anonymous_user_id: '',
        event: 'search_filter',
        filter_name: filterName,
        filter_type: filterType,
        click_action: isChecked ? 'apply filter' : 'remove filter',
        user_id: ''
      };

      if (heartBeatInfo) {
        const { isLoggedInUser, sessionId } = heartBeatInfo;
        if (sessionId) {
          isLoggedInUser ? (gtmData.user_id = sessionId) : (gtmData.anonymous_user_id = sessionId);
        }
      }
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(gtmData);
    }
  }

  return (
    <>
      {isToggleFacet ? (
        <ToggleRefinement
          onClick={(e: SyntheticEvent<HTMLDivElement>) =>
            handleSearchInteractionEvent(
              attribute,
              (e.target as HTMLInputElement).checked,
              (e.target as HTMLInputElement).checked
            )
          }
          classNames={{
            label: styles.toggleLabel,
            checkbox: styles.checkbox
          }}
          attribute={attribute}
          label={toggleFacetLabel ?? attribute}
        />
      ) : (
        <>
          <Panel
            header={FACETS_TITLE_MAP[attribute] ?? attribute}
            showTitle={canRenderRefinementList}
          >
            <RefinementList
              onClick={(e: SyntheticEvent<HTMLDivElement>) =>
                handleSearchInteractionEvent(
                  (e.target as HTMLInputElement).value,
                  attribute,
                  (e.target as HTMLInputElement).checked
                )
              }
              key={attribute}
              attribute={attribute}
              limit={limit}
              showMore={showMore}
              sortBy={['count', 'name']}
            />
          </Panel>
        </>
      )}
      {!isLastAttribute && canRenderRefinementList && <hr className={WidgetStyles.filterDivider} />}
    </>
  );
}
