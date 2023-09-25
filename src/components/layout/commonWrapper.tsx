import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from '@Redux/store';

import ThirdPartyFileNameList from '@Components/3rdPartyServices';
import HlSnackBar from '@Components/common/hlSnackBar';
import Spinner from '@Components/common/spinner';
import { getHeartBeatGql, getMyProfileDetails } from '@Lib/cms/accountpage';
import { getCustomerAddress, getCustomerPaymentOption } from '@Lib/cms/myAccountPage';

import { getCartCount } from '@Lib/cms/globalHeaderFooter';
import { getCountriesAndStateList } from '@Lib/cms/checkoutPage';
import { PAGE_PATH_TYPE, defaultPageType } from '@Constants/generalConstants';
import { createShoppingList, getShoppingListsWithItems } from '@Lib/cms/shoppingList';

const DynamicCsrArray = ThirdPartyFileNameList.map((comp) =>
  dynamic(() => import(`@Components/3rdPartyServices/${comp}`), {
    ssr: false
  })
);
const WithSnackbar = dynamic(() => import(`@Components/common/h1Alert`), {
  ssr: false
});

/*Run time Execution*/
export default function CommonWrapper(props: any): JSX.Element {
  const { asPath } = useRouter();
  const dispatch = useDispatch();
  const { children, recentlyViewedKeys } = props;

  const {
    heartBeatInfo: { isLoggedInUser, isExistingSession },
    heartBeatInfo
  } = useSelector((state) => state.auth);

  const { pageType, currentResolution } = useSelector((state) => state.layout);

  const [deviceType, setDeviceType] = useState('DESKTOP');
  const [isCheckoutOrAccountPage, setCheckoutOrAccountPage] = useState(false);

  useEffect(() => {
    triggerHeartBeat();

    dispatch({
      type: 'UPDATE_RECENTLY_VIEWED_PRODUCT_KEYS',
      payload: recentlyViewedKeys
    });
  }, [asPath]);

  useEffect(() => {
    const identifyDeviceType = () => {
      if (window.innerWidth > 1023) return 'DESKTOP';
      if (window.innerWidth > 699) return 'TABLET';
      return 'MOBILE';
    };

    const handleResize = () => {
      const deviceType = identifyDeviceType();

      if (currentResolution !== deviceType) {
        dispatch({
          type: 'UPDATE_SCREEN_RESOLUTION',
          payload: deviceType
        });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [currentResolution]);

  useEffect(() => {
    if (!pageType?.isPageTypeUpdated || !isExistingSession) {
      return;
    }

    if (pageType.isCheckoutPage || pageType.isMyAccountPage) {
      setCheckoutOrAccountPage(true);
    }
    if (pageType.isCheckoutPage || pageType.isCartPage) {
      fetchCountryStateList();
    }
    if (!pageType?.isCartPage && !pageType?.isCheckoutPage && !pageType?.isOrderConfirmationPage) {
      fetchCartCount();
    }
  }, [isExistingSession, pageType]);

  useEffect(() => {
    async function validatePageType() {
      const newPageType = defaultPageType;
      PAGE_PATH_TYPE.forEach((e) => {
        newPageType[e.key] = asPath.indexOf(e.path) !== -1;

        if (newPageType.isCategoryPage) {
          const breadCrumbPathList = asPath.split('/');
          const isGiftCardsCategory = asPath?.toLowerCase().indexOf('gift-cards') !== -1;
          const isDiyCategory = asPath?.toLowerCase().indexOf('diy-') !== -1;
          const isDlpPage =
            breadCrumbPathList.length > 2 && breadCrumbPathList[2] === 'c' && !isGiftCardsCategory;
          newPageType.isDlpPage = isDlpPage;
          newPageType.isPlpPage = !isDlpPage;
          newPageType.isGiftCardsCategory = isGiftCardsCategory;
          newPageType.isDiyCategoryPage = isDiyCategory;
        }

        if (newPageType.isPdpPage) {
          const lowerCasePath = asPath?.toLowerCase();
          newPageType.isGiftCardsDetailsPage =
            lowerCasePath.indexOf('gc_') !== -1 || lowerCasePath.indexOf('gc-') !== -1;
        }

        newPageType.isHomePage = asPath === '/';
        newPageType.currentPath = asPath;
      });

      dispatch({
        type: 'UPDATE_PAGE_TYPE',
        payload: { ...newPageType, isPageTypeUpdated: true }
      });
    }
    validatePageType();
  }, [asPath]);

  useEffect(() => {
    if (isLoggedInUser && isCheckoutOrAccountPage) {
      getCustomerPaymentsAndAddress();
    }
  }, [isLoggedInUser, isCheckoutOrAccountPage]);

  useEffect(() => {
    if (isLoggedInUser && pageType?.isMyAccountPage) {
      dispatch({
        type: 'LOAD_SPINNER',
        payload: {
          isVisible: true,
          className: '',
          isInitialLoading: true,
          isPageLoad: true
        }
      });
    }

    if (isLoggedInUser && !pageType.isLoginPage) {
      getCustomerProfile();
    }
  }, [isLoggedInUser]);

  async function fetchCountryStateList() {
    const countryStateList = await getCountriesAndStateList();
    dispatch({
      type: 'UPDATE_COUNTRY_STATE_LIST',
      payload: countryStateList
    });
  }

  async function fetchCartCount() {
    const lineItemCount = await getCartCount({});
    dispatch({
      type: 'UPDATE_LINE_ITEM_COUNT',
      payload: { lineItemCount }
    });
  }

  async function triggerHeartBeat() {
    const data = await getHeartBeatGql({});
    const isGuestUser = data?.sessionState === 'GUEST';
    dispatch({
      type: 'UPDATE_HEART_BEAT',
      payload: { ...data, isGuestUser, isExistingSession: true }
    });
  }

  async function getCustomerProfile() {
    const [profileInfo, shopListResp] = await Promise.all([
      getMyProfileDetails(),
      getShoppingListsWithItems()
    ]);

    dispatch({
      type: 'UPDATE_MY_PROFILE',
      payload: profileInfo
    });

    dispatch({
      type: 'UPDATE_SHOPPING_LISTS',
      payload: shopListResp?.shoppingList ?? []
    });

    if (pageType?.isMyAccountPage) {
      dispatch({
        type: 'LOAD_SPINNER',
        payload: {
          isVisible: false,
          className: '',
          isInitialLoading: false,
          isPageLoad: false
        }
      });
    }
  }

  async function getCustomerPaymentsAndAddress() {
    const paymentResponse = await getCustomerPaymentOption();
    dispatch({
      type: 'UPDATE_PAYMENTS_LIST',
      payload: paymentResponse
    });

    const addressResponse = await getCustomerAddress();
    dispatch({
      type: 'UPDATE_ADDRESS_LIST',
      payload: addressResponse
    });
  }

  return (
    <>
      {DynamicCsrArray.map((DynamicComponent, i) => (
        <DynamicComponent key={i} />
      ))}
      <HlSnackBar />
      <WithSnackbar />
      <Spinner />
      {children}
    </>
  );
}
