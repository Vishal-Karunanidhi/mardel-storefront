import { FiltersContext } from '@Components/layout';
import { SORT_BY } from '@Constants/categoryConstants';
import React, { Fragment, useContext } from 'react';
import { useSortBy } from 'react-instantsearch-hooks-web';
import SortByStyles from '@Styles/plp/categoryListingPages.module.scss';
import {
  Drawer,
  FormControl,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { RenderDivider } from '@Components/plp/customDynamicWidgets';
import { useSelector, useDispatch } from '@Redux/store';
import { Ga4SearchSortDataLayer } from 'src/interfaces/ga4DataLayer';

function ProductListSortByDrawer() {
  const dispatch = useDispatch();
  const { currentRefinedSortBy } = useSelector((state) => state.layout) ?? {};
  const { heartBeatInfo } = useSelector((state) => state.auth) ?? {};
  const { showPlpSortBy, setShowPlpSortBy } = useContext(FiltersContext);
  const { refine, options, currentRefinement } = useSortBy(SORT_BY);

  const sortSelectionData = options?.map(({ label, value }) => ({ code: value, name: label }));

  function handleSearchSortEvent(sortLabel: string): void {
    if (window && heartBeatInfo) {
      const { isLoggedInUser, sessionId } = heartBeatInfo;
      const gtmData: Ga4SearchSortDataLayer = {
        anonymous_user_id: '',
        event: 'search_sort',
        sort_label: sortLabel,
        user_id: ''
      };

      if (sessionId) {
        isLoggedInUser ? (gtmData.user_id = sessionId) : (gtmData.anonymous_user_id = sessionId);
      }
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(gtmData);
    }
  }

  return (
    <Drawer
      ModalProps={{
        keepMounted: true
      }}
      PaperProps={{
        className: SortByStyles.drawerPaperProps
      }}
      variant="temporary"
      anchor="left"
      open={showPlpSortBy}
      onClose={() => setShowPlpSortBy(false)}
      className={SortByStyles.drawerStyles}
    >
      <div className={SortByStyles.filtersHeaderContainer}>
        <div className={SortByStyles.filtersTitle}>
          <IconButton
            aria-label="Filter Price Low to High"
            size="large"
            color="inherit"
            className={SortByStyles.filtersIcon}
          >
            <img alt="Sort Icon" src={'/icons/sortIcon.svg'} height="24" width="24" />
          </IconButton>
          <span className={SortByStyles.filtersHeader}>{currentRefinedSortBy}</span>
        </div>
        <div>
          <IconButton
            aria-label="Sort"
            size="large"
            color="inherit"
            className={SortByStyles.closeIcon}
            onClick={() => setShowPlpSortBy(false)}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </div>
      </div>
      <div className={SortByStyles.dynamicWidgetWrapper}>
        <div className={SortByStyles.filterSection}>
          <label className={SortByStyles.filterLabel}>{'Sort By'}</label>
        </div>
        <RenderDivider className={SortByStyles.titleDivider} />
        <FormControl
          sx={{
            width: '100%'
          }}
        >
          <RadioGroup
            name="radio-buttons-group"
            className={SortByStyles.sortByRadioGroup}
            value={currentRefinement}
            onChange={(event) => {
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
          >
            {sortSelectionData?.map((data, key) => (
              <Fragment key={key}>
                <FormControlLabel
                  value={data.code}
                  control={
                    <Radio
                      sx={{
                        color: '#333',
                        '&.Mui-checked': {
                          color: '#003087'
                        }
                      }}
                    />
                  }
                  label={data.name}
                  labelPlacement="start"
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    margin: 0
                  }}
                />
                <hr className={SortByStyles.filterDivider} />
              </Fragment>
            ))}
          </RadioGroup>
        </FormControl>
      </div>
    </Drawer>
  );
}

export default ProductListSortByDrawer;
