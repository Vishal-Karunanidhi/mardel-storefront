import { IconButton } from '@mui/material';
import { useSelector } from '@Redux/store';
import styles from '@Styles/plp/productListPage.module.scss';
import filtersIcon from '@Icons/plp/filtersIcon.svg';
import sortIcon from '@Icons/plp/sortIcon.svg';

function DiyListFooter({ setShowDiyFiltersDrawer, setShowDiySortBy, filterCount = 0 }) {
  const { currentRefinedDIYSortBy } = useSelector((state) => state.layout) ?? {};

  return (
    <div className={styles.filtersFooterContainer}>
      <div className={styles.filtersSection} onClick={() => setShowDiyFiltersDrawer(true)}>
        <IconButton
          aria-label="Filters"
          size="large"
          color="inherit"
          className={styles.filtersIcon}
        >
          <img src={'/icons/filtersIcon.svg'} alt="Filters Icon" height="24" width="24" />
        </IconButton>
        <span className={styles.filtersHeader}>{`FILTERS (${filterCount})`} </span>
      </div>
      <div className={styles.sortBySection} onClick={() => setShowDiySortBy(true)}>
        <IconButton aria-label="delete" size="large" color="inherit" className={styles.sortIcon}>
          <img src={'/icons/sortIcon.svg'} alt="Sort Icon" height="24" width="24" />
        </IconButton>
        <span className={styles.filtersHeader}>{currentRefinedDIYSortBy}</span>
      </div>
    </div>
  );
}
export default DiyListFooter;
