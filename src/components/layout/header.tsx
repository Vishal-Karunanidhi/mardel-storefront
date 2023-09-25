import { FavoriteBorder, LocationOnOutlined } from '@mui/icons-material';
import { getStoresLatLong } from '@Lib/cms/storeFinder';
import { HlPageLinkButton } from '@Components/common/button';
import { MegaNavChildren } from 'src/types/cms/raw/megaNav.raw';
import { printBodyItems } from '@Lib/common/utility';
import { SetStateAction, useEffect, useRef, useState } from 'react';
import { spinnerStart } from '@Utils/spinnerUtil';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from '@Redux/store';
import { useRouter } from 'next/router';
import { weeklyAdHeaderLinks } from '@Constants/weelyAdConstants';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import Badge, { BadgeProps } from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import HeaderAccountSignUp from '@Components/layout/headerAccountSignUp';
import HeaderShoppingListModal from './headerShoppingListModal';
import HeaderSignUpMobileComponent from '@Components/layout/headerSignUpMobileComponent';
import HeaderStoreLocator from './headerStoreLocator';
import HeaderStoreLocatorMobileComponent from './headerStoreLocatorMobileComponent';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import MegaNavCard from './megaNavCard';
import MegaNavDrawer from './megaNavDrawer';
import MiniCartDrawer from '../cartPage/miniCartDrawer';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import Stack from '@mui/material/Stack';
import styles from '@Styles/layout/header.module.scss';
import weeklyAdStyles from '@Styles/weeklyAd/weeklyAd.module.scss';
import AlgoliaAutoComplete from '@Components/3rdPartyServices/algoliaAutoComplete';

const cartDependentPages = ['/cart', '/checkout', '/orderSummary'];

const StyledBadge = styled(Badge)<BadgeProps>(({}) => ({
  '& .MuiBadge-badge': {
    background: '#EDEDED',
    color: '#000000',
    borderRadius: '7.5px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end'
  }
}));

let lastSelectedPage = '';

export type ProductImageSet = { [key: string]: JSX.Element[] };

export default function Header(props): JSX.Element {
  const dispatch = useDispatch();
  const router = useRouter();
  const { megaNavData, megaNavMobileData, globalFooterCmsData } = props;
  const { logoNavigator, checkoutHeader } = props?.composedHeader;

  const {
    lineItemCount,
    stepperHeaderNumber,
    currentSelectedIndex,
    pageType,
    openMiniCartDrawer,
    openMegaNavDrawer
  } = useSelector((state) => state.layout);
  const {
    heartBeatInfo: { isLoggedInUser }
  } = useSelector((state: any) => state.auth);

  const { orderConfMode } = useSelector((state) => state.checkout);
  const { searchKey } = useSelector((state) => state.plp);
  const { isCheckoutPage, isCartPage, isWeeklyAdPage } = pageType;

  const [departmentFromChild, setDepartmentFromChild] = useState({});
  const [showHeaderSignupModal, setShowHeaderSignupModal] = useState(false);
  const [showHeaderStoreLocatorModal, setShowHeaderStoreLocatorModal] = useState(false);
  const [showShoppingListModal, setShowShoppingListModal] = useState(false);

  const [coordinates, setCoordinates] = useState<any>(null);
  const [currentStoreData, setCurrentStoreData] = useState<any>(null);

  const anchorEl = useRef<HTMLButtonElement>(null);

  const { asPath } = useRouter();

  const categoryPageCheck = pageType.isCategoryPage && lastSelectedPage;

  const isCartBasedPage = cartDependentPages.includes(asPath);

  const handleShowSignupModal = () => {
    setShowHeaderSignupModal(true);
  };

  const handleSignupCloseModal = () => {
    setShowHeaderSignupModal(false);
    dispatch({
      type: 'ACCOUNT_VIEW_ORDER_FLAG',
      payload: {
        showOrderFullDetails: false,
        orderDetails: {}
      }
    });
  };

  const handleShowStoreLocatorModal = () => {
    setShowHeaderStoreLocatorModal(true);
  };

  const handleStoreLocatorCloseModal = () => {
    setShowHeaderStoreLocatorModal(false);
  };

  const handleShowShoppingListModal = () => {
    setShowShoppingListModal(true);
  };

  const setLocationCookie = async () => {
    const store = await getStoresLatLong(coordinates?.latitude, coordinates?.longitude);
    const currentStoreData = store?.getStoresLatLong?.data[0];
    sessionStorage.setItem('store-data', JSON.stringify(currentStoreData));
    fetchStoreData();
  };

  const fetchStoreData = async () => {
    const response = sessionStorage.getItem('store-data');
    if (response) {
      setCurrentStoreData(JSON.parse(response));
    }
  };

  useEffect(() => {
    if (coordinates?.latitude && coordinates?.longitude) {
      setLocationCookie();
    }
  }, [coordinates]);

  useEffect(() => {
    const { query } = router;
    if (pageType.isSrpPage) {
      const payload = query?.text ?? query[`${currentSelectedIndex}[configure][query]`];
      dispatch({ type: 'UPDATE_SEARCH_KEY', payload });
    }

    const storeSessionData = sessionStorage.getItem('store-data');

    if (!storeSessionData) {
      navigator?.geolocation.getCurrentPosition((position) => {
        if (position) {
          setCoordinates({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        }
      });
    } else {
      fetchStoreData();
    }
  }, []);

  useEffect(() => {
    lastSelectedPage = localStorage.getItem('selectedTab') ?? megaNavData?.[1]?.label;
  }, [megaNavData]);

  useEffect(() => {
    if (showHeaderSignupModal || showShoppingListModal || openMiniCartDrawer || openMegaNavDrawer) {
      setShowHeaderStoreLocatorModal(false);
    }
    if (
      showHeaderStoreLocatorModal ||
      showShoppingListModal ||
      openMiniCartDrawer ||
      openMegaNavDrawer
    ) {
      setShowHeaderSignupModal(false);
    }
    if (
      showHeaderStoreLocatorModal ||
      showHeaderSignupModal ||
      openMiniCartDrawer ||
      openMegaNavDrawer
    ) {
      setShowShoppingListModal(false);
    }
  }, [
    showHeaderSignupModal,
    showHeaderStoreLocatorModal,
    showShoppingListModal,
    openMiniCartDrawer,
    openMegaNavDrawer
  ]);

  const returnToPageComp = (
    <section className={styles.backButton}>
      <a
        href={
          isWeeklyAdPage
            ? weeklyAdHeaderLinks.returnToAd.value
            : checkoutHeader?.returnToCart?.value
        }
        rel="noreferrer"
        target={isWeeklyAdPage ? '' : checkoutHeader?.returnToCart?.openInNewTab ? '_blank' : ''}
      >
        {isWeeklyAdPage
          ? weeklyAdHeaderLinks.returnToAd.label
          : checkoutHeader?.returnToCart?.label}
      </a>
    </section>
  );

  const minicartSpinner = () => {
    spinnerStart.payload.page.type = 'minicart';
    spinnerStart.payload.isVisible = false;
    dispatch(spinnerStart);
  };
  return (
    <>
      <Box sx={{ width: '100%' }} className={styles.header}>
        <a className={styles.accessibleSkip} href="#main">
          Skip Navigation
        </a>
        <Stack
          className={
            isCheckoutPage ? styles.checkoutHeaderContainer : styles.standardCheckoutContainer
          }
        >
          <div
            className={`${
              isCheckoutPage || isWeeklyAdPage ? styles.checkoutLogoStack : styles.logoStack
            } `}
          >
            <Grid item className={`${styles.logoSection} ${styles.gridRow}`}>
              {!(isCheckoutPage || isWeeklyAdPage) && (
                <MegaNavDrawer
                  globalFooterCmsData={globalFooterCmsData}
                  megaNavData={megaNavData}
                  megaNavMobileData={megaNavMobileData}
                />
              )}
              <Link passHref href={logoNavigator?.Navigator?.value}>
                <a className={styles.imageButton}>
                  <img
                    src={logoNavigator?.logo?.url}
                    alt={logoNavigator?.logo?.name}
                    width={isCheckoutPage || isWeeklyAdPage ? 150 : 300}
                    height={isCheckoutPage || isWeeklyAdPage ? 15 : 30}
                    className={styles.hl_logo}
                  />
                </a>
              </Link>
            </Grid>
            {!(isCheckoutPage || isWeeklyAdPage) ? (
              <Grid item className={`${styles.otherItemsSection} ${styles.gridRow}`}>
                <HeaderStoreLocator storeData={currentStoreData} />
                <HeaderAccountSignUp />

                <span className={styles.accountIcon}>
                  <IconButton
                    className={styles.accountIconButton}
                    onClick={handleShowStoreLocatorModal}
                  >
                    <LocationOnOutlined />
                  </IconButton>
                </span>

                <span className={styles.accountIcon}>
                  <IconButton
                    className={
                      isLoggedInUser
                        ? styles.accountIconButton
                        : styles.accountIconButton + ' ' + styles.accountProfile
                    }
                    onClick={handleShowSignupModal}
                  >
                    <AccountCircleOutlinedIcon />
                  </IconButton>
                </span>

                <span style={{ display: 'unset' }} className={styles.accountIcon}>
                  <IconButton
                    disableRipple
                    aria-label="shopping list"
                    className={`${styles.accountIconButton} ${styles.shoppingListIcon}`}
                    onClick={handleShowShoppingListModal}
                    ref={anchorEl}
                  >
                    <FavoriteBorder className={styles.shoppingListIcon} />
                  </IconButton>
                </span>

                <IconButton
                  disableRipple
                  aria-label="cart"
                  className={styles.cartButton}
                  data-testid="cart-button"
                  onClick={() => {
                    if (isCartPage) {
                      window.location = window.location;
                    } else {
                      dispatch({
                        type: 'BOOT_MINI_CART',
                        payload: true
                      });
                      minicartSpinner();
                    }
                  }}
                >
                  <StyledBadge
                    overlap="rectangular"
                    className={styles.cartBadge}
                    badgeContent={`${lineItemCount}`}
                    invisible={lineItemCount ? false : true}
                    max={99999}
                  >
                    <ShoppingCartOutlinedIcon className={styles.cartButtonIcon} />
                  </StyledBadge>
                </IconButton>
              </Grid>
            ) : (
              <Grid className={styles.checkoutGrid} style={{ margin: 0, padding: 0 }}>
                {!orderConfMode && (
                  <div className={styles.cartReturnMobile}>{returnToPageComp}</div>
                )}
              </Grid>
            )}

            {/* Mini cart Drawer section */}
            {!isCartBasedPage && (
              <MiniCartDrawer
                closeMinicartDrawer={() => {
                  dispatch({
                    type: 'BOOT_MINI_CART',
                    payload: false
                  });
                }}
              />
            )}
          </div>
          {(isCheckoutPage || isWeeklyAdPage) && (
            <Grid className={styles.checkoutGrid}>
              {!orderConfMode && (
                <div>
                  <div className={styles.stepperDiv}>
                    <h1 className={styles.checkoutTitle}>
                      {isWeeklyAdPage
                        ? weeklyAdHeaderLinks.headerTitle
                        : checkoutHeader?.checkoutLabel}
                    </h1>
                    <span className={styles.stepGroup}>
                      {isWeeklyAdPage ? (
                        <div className={weeklyAdStyles.weeklyAdHeaderLinks}>
                          <a href={weeklyAdHeaderLinks.shopCategories.value}>
                            {weeklyAdHeaderLinks.shopCategories.label}
                          </a>
                          <button
                            className={weeklyAdStyles.weeklyAdHeaderLinkButton}
                            onClick={() => printBodyItems()}
                            type="button"
                          >
                            {weeklyAdHeaderLinks.printAd.label}
                          </button>
                        </div>
                      ) : (
                        checkoutHeader?.checkoutSteps?.map((e: string, i: number) => (
                          <span key={i} style={{ width: 95 }}>
                            <button
                              id={'checkOutStep' + i}
                              style={{
                                background: i <= stepperHeaderNumber ? '#003087' : 'transparent',
                                color: i <= stepperHeaderNumber ? 'white' : 'black'
                              }}
                            >
                              {i + 1}
                            </button>
                            <label>{e}</label>
                          </span>
                        ))
                      )}
                    </span>
                  </div>
                  <div className={styles.cartReturnDesk}>{returnToPageComp}</div>
                </div>
              )}
            </Grid>
          )}
          {!(isCheckoutPage || isWeeklyAdPage) && (
            <nav className={styles.nav}>
              <ul className={`${styles.megaNav}`}>
                {megaNavData.map((root: MegaNavChildren, i: number) => {
                  const { theme, label } = root;
                  if (theme === 'MegaNav-CTA') {
                    return (
                      <li className={styles.weeklyAd} key={root.deliveryId + i}>
                        <HlPageLinkButton
                          href={'/weekly-ad'}
                          anchorProps={{ tabIndex: -1 }}
                          buttonTitle={label}
                          parentDivClass={styles.megaNavWeeklyButtonContentInfoOutline}
                          buttonClass={styles.megaNavWeeklyButtonContentInfoOutlineLink}
                        />
                      </li>
                    );
                  } else {
                    return (
                      <li
                        aria-label={label}
                        aria-roledescription="Main Navigation"
                        className={categoryPageCheck === label ? styles.selected : styles.default}
                        key={root.deliveryId}
                        tabIndex={0}
                      >
                        <span>{label}</span>
                        <MegaNavCard
                          handleDepartmentFromChildChange={(info: SetStateAction<{}>) => {
                            setDepartmentFromChild(info);
                          }}
                          departmentFromChild={departmentFromChild}
                          {...root}
                          parentTab={label}
                        />
                      </li>
                    );
                  }
                })}
                <li className={styles.searchBox}>
                  <AlgoliaAutoComplete />
                </li>
              </ul>
            </nav>
          )}
        </Stack>
      </Box>
      {showHeaderSignupModal && (
        <HeaderSignUpMobileComponent handleSignupCloseModal={handleSignupCloseModal} />
      )}
      {showHeaderStoreLocatorModal && (
        <HeaderStoreLocatorMobileComponent
          storeData={currentStoreData}
          handleStoreLocatorCloseModal={handleStoreLocatorCloseModal}
        />
      )}
      {showShoppingListModal && (
        <HeaderShoppingListModal
          showShoppingListModal={showShoppingListModal}
          setShowShoppingListModal={setShowShoppingListModal}
          anchorElement={anchorEl.current}
        />
      )}
    </>
  );
}
