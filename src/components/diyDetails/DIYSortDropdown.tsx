import { useEffect, useState } from 'react';
import HLSelect from '@Components/common/hlSelect';
import { useDispatch } from '@Redux/store';
import { useSortBy, usePagination, useCurrentRefinements } from 'react-instantsearch-hooks-web';
import { DIY_SORT_BY } from '@Constants/categoryConstants';
import DiyPpStyles from '@Styles/diyInspiration/projectPage.module.scss';

const DIYSortDropdown = ({ resetCSRPageLoad, initialPageLoad }) => {
  const dispatch = useDispatch();
  const { items: facetFilterItems } = useCurrentRefinements();
  const { currentRefinement: currPage } = usePagination();
  const [sortByItem] = useState(DIY_SORT_BY.items);
  const { refine, options, currentRefinement } = useSortBy({ items: sortByItem });
  const sortDIYSelectionData = options?.map(({ label, value }) => ({ code: value, name: label }));
  const totalChoosenFilters = facetFilterItems.flatMap((e) => e.refinements);

  useEffect(() => {
    if (!initialPageLoad) {
      if (typeof document !== 'undefined') {
        return;
      }
    } else {
      resetCSRPageLoad();
    }
  }, [totalChoosenFilters.length, currPage, currentRefinement]);

  return (
    <>
      <HLSelect
        selectBoxData={sortDIYSelectionData}
        selectBoxValue={[currentRefinement]}
        handleSelectOnChange={(event) => {
          dispatch({
            type: 'UPDATE_DIY_CURRENT_SORT_REFINEMENT',
            payload: event?.target?.value
          });
          refine(event?.target?.value);
        }}
      />
    </>
  );
};

export default DIYSortDropdown;
