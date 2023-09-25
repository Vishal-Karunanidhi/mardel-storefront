import { IconButton } from '@mui/material';
import styles from '@Styles/plp/productListPage.module.scss';
import { useSelector } from '@Redux/store';

function ProductListFooter({ setShowPlpFiltersDrawer, setShowPlpSortBy, filterCount = 0 }) {
  const { currentRefinedSortBy } = useSelector((state) => state.layout) ?? {};

  if (filterCount === 0) {
    return <></>;
  }

  return (
    <div className={styles.filtersFooterContainer}>
      <div className={styles.filtersSection} onClick={() => setShowPlpFiltersDrawer(true)}>
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
      <div className={styles.sortBySection} onClick={() => setShowPlpSortBy(true)}>
        <IconButton aria-label="delete" size="large" color="inherit" className={styles.sortIcon}>
          <img src={'/icons/sortIcon.svg'} alt="Sort Icon" height="24" width="24" />
        </IconButton>
        <span className={styles.filtersHeader}>{currentRefinedSortBy}</span>
      </div>
    </div>
  );
}

export default ProductListFooter;
