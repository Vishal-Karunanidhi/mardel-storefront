import CustomHits from '@Components/plp/customHits';
import CustomPagination from '@Components/plp/customPagination';
import CustomWidgetList from '@Components/algolia/customWidgetList';
import styles from '@Styles/algolia/ruleContext.module.scss';
import bodyStyle from '@Styles/algolia/mobileFooter.module.scss';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import MobileFooter from '@Components/algolia/mobileFooter';
import CloseIcon from '@mui/icons-material/Close';

type Props = {
  searchTerm: string;
  resultCount: number;
  setResultCount: Dispatch<SetStateAction<number>>;
  fromParentPageType?: string;
  optionalCustomHitsHeader?: JSX.Element;
};

const mobileAndTabletBreakpoint: number = 1024;
export default function AlgoliaListingPage({
  searchTerm,
  resultCount,
  setResultCount,
  fromParentPageType = 'PLP',
  optionalCustomHitsHeader
}: Props) {
  const showModal = useState<boolean>();
  const [showModalBackdrop, setShowModalBackdrop] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => {
        if (window.innerWidth < mobileAndTabletBreakpoint) {
          setIsMobile(true);
        } else {
          setIsMobile(false);
        }
      });
      return window.innerWidth < mobileAndTabletBreakpoint;
    }
    return true;
  });
  const mobileWidgetMenu = useRef<HTMLDivElement>();
  const desktopWidgetMenu = useRef<HTMLDivElement>();
  const modalBackdrop = useRef<HTMLDivElement>();

  useEffect(() => {
    if (isMobile) {
      desktopWidgetMenu.current.classList.add(styles.hidden);
    } else {
      mobileWidgetMenu.current.classList.add(styles.hidden);
      desktopWidgetMenu.current.classList.remove(styles.hidden);
      document.querySelector('body').classList.remove(bodyStyle.hidden);
      showModal[1](false);
      setShowModalBackdrop(false);
    }
  }, [isMobile]);
  return (
    <>
      {showModalBackdrop && (
        <div
          ref={modalBackdrop}
          className={styles.backdrop}
          onClick={() => {
            mobileWidgetMenu.current.classList.add(styles.hidden);
            document.querySelector('body').classList.remove(bodyStyle.hidden);
            showModal[1](false);
            setShowModalBackdrop(false);
          }}
        />
      )}
      <div className={styles.ruleContext}>
        <div className={styles.ruleContextWidgets}>
          <div ref={desktopWidgetMenu}>
            <CustomWidgetList fromParentPageType={fromParentPageType} />
          </div>
        </div>
        <div className={styles.ruleContextHits}>
          <CustomHits optionalCustomHitsHeader={optionalCustomHitsHeader} listName={searchTerm} />
          <div className={styles.ruleContextHitsPagination}>
            <CustomPagination searchTerm={searchTerm} />
          </div>
        </div>
      </div>
      <div ref={mobileWidgetMenu} className={`${styles.mobileWidgetMenu} ${styles.hidden}`}>
        <div className={styles.mobileWidgetMenuClose}>
          <CloseIcon
            onClick={() => {
              mobileWidgetMenu.current.classList.add(styles.hidden);
              if (document) {
                document.querySelector('body').classList.remove(bodyStyle.hidden);
              }
              setShowModalBackdrop(false);
            }}
          />
        </div>
        <CustomWidgetList fromParentPageType={fromParentPageType} />
      </div>
      <MobileFooter
        setShowModalBackdrop={setShowModalBackdrop}
        mobileWidgetMenu={mobileWidgetMenu}
        resultCount={resultCount}
        setResultCount={setResultCount}
        showModal={showModal}
      />
    </>
  );
}
