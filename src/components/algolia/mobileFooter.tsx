import { Dispatch, Fragment, MutableRefObject, SetStateAction, useEffect, useState } from 'react';
import styles from '@Styles/algolia/mobileFooter.module.scss';
import CloseIcon from '@mui/icons-material/Close';
import { useConnector, useSortBy } from 'react-instantsearch-hooks-web';
import { SORT_BY } from '@Constants/categoryConstants';
import connectStats from 'instantsearch.js/es/connectors/stats/connectStats';
import mobileWidgetStyles from '@Styles/algolia/ruleContext.module.scss';
import { SortByItem } from 'instantsearch.js/es/connectors/sort-by/connectSortBy';
import { Ga4SearchSortDataLayer } from 'src/interfaces/ga4DataLayer';
import { useSelector } from '@Redux/store';

type Props = {
  setShowModalBackdrop: Dispatch<SetStateAction<boolean>>;
  showModal: [boolean, Dispatch<SetStateAction<boolean>>];
  mobileWidgetMenu: MutableRefObject<HTMLDivElement>;
  setResultCount: Dispatch<SetStateAction<number>>;
  resultCount: number;
};

export default function MobileFooter({
  setShowModalBackdrop,
  showModal,
  mobileWidgetMenu,
  setResultCount,
  resultCount
}: Props) {
  const { refine, options } = useSortBy(SORT_BY);
  const [showModalState, setShowModal] = showModal;
  const [currentSortBy, setCurrentSortBy] = useState<string>(options.at(0).label);
  const { nbHits } = useConnector(connectStats);
  const { heartBeatInfo } = useSelector((state) => state.auth) ?? {};

  useEffect(() => {
    setResultCount(nbHits as number);
  }, [nbHits]);

  function handleFilterModal(isFilterModal: boolean = false) {
    if (!showModalState) {
      setShowModal((prevState) => {
        if (!prevState && document) {
          document.querySelector('body').classList.add(styles.hidden);
        }
        if (prevState) {
          document.querySelector('body').classList.remove(styles.hidden);
        }
        if (isFilterModal) {
          mobileWidgetMenu.current.classList.remove(mobileWidgetStyles.hidden);
          return;
        }
        return true;
      });
      setShowModalBackdrop(true);
    } else {
      mobileWidgetMenu.current.classList.add(mobileWidgetStyles.hidden);
      document.querySelector('body').classList.remove(styles.hidden);
      setShowModal(false);
      setShowModalBackdrop(false);
    }
  }

  function handleSearchSortEvent(sortLabel: string): void {
    if (window) {
      const gtmData: Ga4SearchSortDataLayer = {
        anonymous_user_id: '',
        event: 'search_sort',
        sort_label: sortLabel,
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

  function RenderDrawer() {
    return (
      <div className={styles.drawerContainer}>
        <div className={styles.drawerContainerHeader}>
          <div className={styles.drawerContainerHeaderTitle}>
            <img alt={'Sort By Icon'} src={'/icons/sortIcon.svg'} height="24" width="24" />
            {currentSortBy}
          </div>
          <CloseIcon onClick={() => handleFilterModal()} />
        </div>
        <div className={styles.drawerContainerSortBy}>
          <div className={styles.drawerContainerSortByTitle}>Sort By</div>
          <hr className={styles.drawerContainerSortByTitleDivider} />
          {options?.map(({ label: name, value: code }: SortByItem, index: number) => (
            <Fragment key={index}>
              <div className={styles.drawerContainerSortByItem}>
                <label htmlFor={name}>{name}</label>
                <input
                  onChange={() => {
                    setCurrentSortBy(name);
                    handleSearchSortEvent(name);
                    refine(code);
                  }}
                  checked={name === currentSortBy}
                  type="radio"
                  id={name}
                />
              </div>
              <hr />
            </Fragment>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {showModalState && <RenderDrawer />}
      <div className={styles.footerContainer}>
        <div className={styles.footerContainerSection} onClick={() => handleFilterModal(true)}>
          <img src={'/icons/filtersIcon.svg'} alt="Filter Icon" height="24" width="24" />
          {`FILTERS (${resultCount})`}
        </div>
        <div className={styles.footerContainerSection} onClick={() => handleFilterModal()}>
          <img src={'/icons/sortIcon.svg'} alt="Sort Icon" height="24" width="24" />
          {currentSortBy}
        </div>
      </div>
    </>
  );
}
