import { useState, createContext, Fragment } from 'react';
import { useSelector } from '@Redux/store';
import Header from '@Components/layout/header';
import Footer from '@Components/layout/footer';
import NotificationBar from '@Components/global/notificationBar';
import { HeaderContentBlockData } from 'src/types/header';
import { LayoutIndexProps } from 'src/types/homepage';

const FiltersContext = createContext({
  showPlpFiltersDrawer: false,
  setShowPlpFiltersDrawer: (state: boolean) => {},
  showPlpSortBy: false,
  setShowPlpSortBy: (state: boolean) => {},
  showPlpStickyFooter: true,
  setShowPlpStickyFooter: (state: boolean) => {},
  plpMobileFilterCount: 1,
  setPlpMobileFilterCount: (state: any) => {},
  diyMobileFilterCount: 1,
  setDiyMobileFilterCount: (state: any) => {},
  showDiySortBy: false,
  setShowDiySortBy: (state: boolean) => {},
  showDiyFilterDrawer: false,
  setShowDiyFiltersDrawer: (state: boolean) => {},
  showDiyStickyFooter: false,
  setShowDiyStickyFooter: (state: boolean) => {}
});

/*Run time Execution*/
export default function Index(props: LayoutIndexProps): JSX.Element {
  const { pageType } = useSelector((state) => state.layout);
  const [showPlpFiltersDrawer, setShowPlpFiltersDrawer] = useState(false);
  const [showPlpSortBy, setShowPlpSortBy] = useState(false);
  const [plpMobileFilterCount, setPlpMobileFilterCount] = useState<number>(1);
  const [diyMobileFilterCount, setDiyMobileFilterCount] = useState<number>(1);
  const [showPlpStickyFooter, setShowPlpStickyFooter] = useState(true);
  const [showDiySortBy, setShowDiySortBy] = useState(false);
  const [showDiyFilterDrawer, setShowDiyFiltersDrawer] = useState(false);
  const [showDiyStickyFooter, setShowDiyStickyFooter] = useState(false);
  const { children, globalHeaderCmsData, megaNavData, megaNavMobileData, globalFooterCmsData } =
    props;

  const composedHeader = globalHeaderCmsData?.find((e) => e?.key === 'ComposedHeader');

  const globalHeaderComponents =
    globalHeaderCmsData &&
    globalHeaderCmsData?.map((dataProps: HeaderContentBlockData, i: number) => {
      let currentComponent: JSX.Element = <></>;
      switch (dataProps.key) {
        case 'NotificationBarSlot':
          if (!dataProps.notifications) break;
          currentComponent = <NotificationBar key={i} {...dataProps} />;
          break;

        case 'PlaceholderContent':
          break;
      }
      return currentComponent ? <Fragment key={i}>{currentComponent}</Fragment> : [];
    });

  return (
    <FiltersContext.Provider
      value={{
        showPlpFiltersDrawer,
        setShowPlpFiltersDrawer: (state) => setShowPlpFiltersDrawer(state),
        showPlpSortBy,
        setShowPlpSortBy: (state) => setShowPlpSortBy(state),
        showPlpStickyFooter,
        setShowPlpStickyFooter: (state) => setShowPlpStickyFooter(state),
        plpMobileFilterCount,
        setPlpMobileFilterCount: (state) => setPlpMobileFilterCount(state),
        diyMobileFilterCount,
        setDiyMobileFilterCount: (state) => setDiyMobileFilterCount(state),
        showDiySortBy,
        setShowDiySortBy: (state) => setShowDiySortBy(state),
        showDiyFilterDrawer,
        setShowDiyFiltersDrawer: (state) => setShowDiyFiltersDrawer(state),
        showDiyStickyFooter,
        setShowDiyStickyFooter: (state) => setShowDiyStickyFooter(state)
      }}
    >
      <header className="header">
        {!(pageType.isCheckoutPage || pageType.isWeeklyAdPage) && globalHeaderComponents}
        {/*TODO: Please Add a Header while starting header-story. commenting out the mock one*/}
        {composedHeader && (
          <Header
            globalFooterCmsData={globalFooterCmsData}
            megaNavData={megaNavData}
            megaNavMobileData={megaNavMobileData}
            composedHeader={composedHeader}
          />
        )}
      </header>
      <main id="main">{children}</main>
      {globalFooterCmsData && (
        <Footer globalFooterCmsData={globalFooterCmsData} {...globalFooterCmsData} />
      )}
    </FiltersContext.Provider>
  );
}

export { FiltersContext };
