import {
  Drawer,
  FormControl,
  FormControlLabel,
  IconButton,
  RadioGroup,
  Radio
} from '@mui/material';
import SortByStyles from '@Styles/plp/categoryListingPages.module.scss';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from '@Redux/store';
import { Fragment, useContext } from 'react';
import { FiltersContext } from '@Components/layout';
import { RenderDivider } from '@Components/plp/customDynamicWidgets';
import { useSortBy } from 'react-instantsearch-hooks-web';
import { DIY_SORT_BY } from '@Constants/categoryConstants';
import filtersIcon from '@Icons/plp/filtersIcon.svg';

function DiyListSortByDrawer() {
  const { currentRefinedDIYSortBy } = useSelector((state) => state.layout ?? {});
  const { showDiySortBy, setShowDiySortBy } = useContext(FiltersContext);
  const dispatch = useDispatch();
  const { refine, options, currentRefinement } = useSortBy(DIY_SORT_BY);

  const diySortByOptions = options.map(({ label, value }) => ({ code: value, name: label }));
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
      open={showDiySortBy}
      onClose={() => setShowDiySortBy(false)}
      className={SortByStyles.drawerStyles}
    >
      <div className={SortByStyles.filtersHeaderContainer}>
        <div className={SortByStyles.filtersTitle}>
          <IconButton
            aria-label="Most Recent"
            size="large"
            color="inherit"
            className={SortByStyles.filtersIcon}
          >
            <img alt="Most Recent" src={'/icons/sortIcon.svg'} height="24" width="24" />
          </IconButton>
          <span className={SortByStyles.filtersHeader}>{currentRefinedDIYSortBy}</span>
        </div>
        <div>
          <IconButton
            aria-label="Sort"
            size="large"
            color="inherit"
            className={SortByStyles.closeIcon}
            onClick={() => setShowDiySortBy(false)}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </div>
      </div>
      <div className={SortByStyles.dynamicWidgetWrapper}>
        <div className={SortByStyles.filtersSection}>
          <label className={SortByStyles.filterLabel}>{'Sort By'}</label>
        </div>
        <RenderDivider className={SortByStyles.titleDivider} />
        <FormControl
          sx={{
            width: '100%'
          }}
        >
          <RadioGroup
            name="radio-button-group"
            className={SortByStyles.sortByRadioGroup}
            value={currentRefinement}
            onChange={(event) => {
              dispatch({
                type: 'UPDATE_DIY_CURRENT_SORT_REFINEMENT',
                payload: event?.target?.value
              });
              refine(event?.target?.value);
            }}
          >
            {diySortByOptions?.map((options, index) => (
              <Fragment key={index}>
                <FormControlLabel
                  value={options.code}
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
                  label={options.name}
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
export default DiyListSortByDrawer;
