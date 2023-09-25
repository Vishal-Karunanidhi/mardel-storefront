import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { GetServerSidePropsResult } from 'next/types';
import { useDispatch, useSelector } from '@Redux/store';
import Breadcrumb from '@Components/breadcrumb/breadcrumb';
import LoginDetails from '@Components/account/loginDetails';
import OrderHistory from '@Components/account/orderHistory';
import AccountOverView from '@Components/account/accountOverView';
import AddressBook from '@Components/myAccount/addressBook';
import GiftCardLookup from '@Components/myAccount/giftCardLookup';
import PaymentOption from '@Components/myAccount/paymentOption';
import OrderDetails from '@Components/account/orderDetails';
import MobileNavAccordion from '@Components/account/mobileNavAccordion';
import DesktopAccountSideNav from '@Components/account/desktopAccountSideNav';
import ShoppingLists from '@Components/account/lists';
import { PopupMeatBall } from '@Components/myAccount/addressBook';
import { MeatBall } from '@Components/myAccount/paymentOption';
import { formatMonth } from '@Lib/common/utility';
import { contentToBreadcrumb } from '@Lib/common/utility';
import { getCookie } from '@Lib/common/serverUtility';
import { getHeartBeatGql } from '@Lib/cms/accountpage';
import { getCountriesAndStateList } from '@Lib/cms/checkoutPage';
import { breadCrumbs, accountListBreadCrumbs } from '@Constants/accountConstants';

import MyAccountStyles from '@Styles/my-account/myAccount.module.scss';

const viewOrderDependentPages = [
  '/my-account#accountOverview',
  '/my-account#orderHistory',
  '/my-account'
];

const getHashMenuName = (asPath) => asPath?.split('#')?.[1];

const DefaultAddressComponent = (props) => {
  const { addressList } = useSelector((state) => state.myAccount);
  const defaultAddress = addressList.find((e) => e.defaultAddress);
  if (!defaultAddress) {
    return <></>;
  }
  const {
    addressNickName,
    firstName,
    lastName,
    addressLineOne,
    addressLineTwo,
    country,
    city,
    state,
    zipCode,
    setDefault = true
  } = defaultAddress;

  const isCanada = country === 'CA';
  return (
    <>
      {props.headerComp ?? <></>}
      <div className={MyAccountStyles.addressComp}>
        <div className={MyAccountStyles.meatBallWrapper}>
          {/* {addressNickName && (
            <span className={MyAccountStyles.addressNickName}>{addressNickName}</span>
          )} */}
          <a>
            <PopupMeatBall setDefault={setDefault} addressProps={defaultAddress} />
          </a>
        </div>
        <span className={MyAccountStyles.userName}>
          {firstName} {lastName}
        </span>
        <span className={MyAccountStyles.addressLineOne}>{addressLineOne}</span>
        {addressLineTwo && <span className={MyAccountStyles.addressLineTwo}>{addressLineTwo}</span>}
        <span className={MyAccountStyles.city}>
          {city}, {state} {isCanada ? '' : zipCode}
        </span>
        <span className={MyAccountStyles.country}>
          {isCanada ? zipCode : ''} {country}
        </span>
        <span className={MyAccountStyles.addressSplitBorder} />
      </div>
    </>
  );
};

const DefaultPaymentComponent = (props) => {
  const { payments } = useSelector((state) => state.myAccount);
  const defaultPaymentOption = payments.find((payment) => payment.defaultPayment);
  if (!defaultPaymentOption) {
    return <></>;
  }
  const { last4Digits, cardType, expiryMonth, expiryYear, defaultPayment, cardExpired, id } =
    defaultPaymentOption;

  return (
    <>
      {props.headerComp ?? <></>}
      <div className={MyAccountStyles.cardInfoWrapper}>
        <div
          className={defaultPayment ? MyAccountStyles.defaultCardInfo : MyAccountStyles.cardInfo}
        >
          <span>{`${cardType} *${last4Digits}`}</span>
          <a>
            <MeatBall isDefault={defaultPayment} cardExpired={cardExpired} paymentId={id} />
          </a>
        </div>
        <div>
          <span>{`Exp ${formatMonth(expiryMonth)}/${expiryYear}`}</span>
          {cardExpired && <span className={MyAccountStyles.cardExpired}>{` (card expired)`}</span>}
        </div>
      </div>
    </>
  );
};

const RenderCurrentMenu = ({ currentMenu }) => {
  const router = useRouter();

  let currentMenuComponent = <></>;
  const currRenderMenu = getHashMenuName(router?.asPath) ?? currentMenu;

  switch (currRenderMenu) {
    case 'accountOverview':
      currentMenuComponent = <AccountOverView />;
      break;
    case 'loginDetails':
      currentMenuComponent = <LoginDetails />;
      break;
    case 'orderHistory':
      currentMenuComponent = <OrderHistory />;
      break;
    case 'lists':
      currentMenuComponent = <ShoppingLists />;
      break;
    case 'addressBook':
      currentMenuComponent = <AddressBook />;
      break;
    case 'paymentOptions':
      currentMenuComponent = (
        <>
          <PaymentOption />
          <Script src="https://flex.cybersource.com/cybersource/assets/microform/0.11/flex-microform.min.js" />
        </>
      );
      break;
    case 'giftCardLookup':
      currentMenuComponent = <GiftCardLookup />;
      break;
  }
  return currentMenuComponent;
};

export default function MyAccount(): JSX.Element {
  const router = useRouter();
  const dispatch = useDispatch();
  const hashMenuPath = getHashMenuName(router?.asPath);
  const [currentMenu, setCurrentMenu] = useState('accountOverview');
  const { heartBeatInfo, myProfileInfo } = useSelector((state) => state.auth);

  const { asPath } = useRouter();
  const { showOrderFullDetails, orderDetails } = useSelector(
    (state) => state.myAccount.accountViewOrder
  );

  const { seeAllClicked, listName, updateIndividualListBreadCrumb } = useSelector(
    (state) => state?.list?.individualListData ?? {}
  );

  const isViewOrderBasedPage =
    viewOrderDependentPages.includes(asPath) && Object.keys(orderDetails).length > 0;

  useEffect(() => {
    if (heartBeatInfo?.sessionState && heartBeatInfo?.sessionState !== 'FULL_AUTH') {
      window.location.href = '/login';
      return;
    }
  }, [asPath]);

  useEffect(() => {
    async function fetchCountryStateData() {
      const countryStateList = await getCountriesAndStateList();
      dispatch({
        type: 'UPDATE_COUNTRY_STATE_LIST',
        payload: countryStateList ?? {}
      });
    }
    if (['addressBook', 'paymentOptions'].includes(hashMenuPath)) {
      fetchCountryStateData();
    }
  }, [hashMenuPath]);

  useEffect(() => {
    if (router?.asPath?.includes('#')) {
      const hashMenu = getHashMenuName(router?.asPath);
      setCurrentMenu(hashMenu);
    }
    router.beforePopState(({ as }) => {
      if (as !== router.asPath) {
        const hashMenu = as?.split('#')?.[1];
        setCurrentMenu(hashMenu);
      }
      return true;
    });

    return () => {
      router.beforePopState(() => true);
    };
  }, [router.asPath, currentMenu]);

  const navProps = {
    currentMenu,
    handleMenuChange: (hash) => {
      if (hash !== 'giftCardLookup' && hash !== currentMenu) {
        dispatch({
          type: 'LOAD_SPINNER',
          payload: {
            isVisible: true,
            className: '',
            isInitialLoading: true,
            isMenuClicked: true
          }
        });
      }
      setCurrentMenu(hash);
      router.push({ hash });
      dispatch({
        type: 'ACCOUNT_VIEW_ORDER_FLAG',
        payload: {
          showOrderFullDetails: false,
          orderDetails: {}
        }
      });

      dispatch({
        type: 'UPDATE_INDIVIDUAL_LIST_BREADCRUMBS',
        payload: {
          seeAllClicked: false,
          listName: '',
          updateIndividualListBreadCrumb: accountListBreadCrumbs
        }
      });
      dispatch({
        type: 'UPDATE_CURRENT_LIST',
        payload: {}
      });
    }
  };

  const isHeartBeatExists = !!Object.keys(heartBeatInfo).length;

  return (
    <>
      {!seeAllClicked && (
        <Breadcrumb
          breadCrumbs={contentToBreadcrumb(
            navProps?.currentMenu === 'lists' ? accountListBreadCrumbs : breadCrumbs
          )}
        />
      )}
      {seeAllClicked && listName && (
        <Breadcrumb breadCrumbs={contentToBreadcrumb(updateIndividualListBreadCrumb)} />
      )}
      <MobileNavAccordion {...navProps} />
      <div className={MyAccountStyles.myAccountPage}>
        <DesktopAccountSideNav {...navProps} />
        {isHeartBeatExists && (
          <>
            {showOrderFullDetails && isViewOrderBasedPage ? (
              <OrderDetails {...orderDetails} />
            ) : (
              <>
                <RenderCurrentMenu currentMenu={currentMenu} />
              </>
            )}
          </>
        )}
      </div>
    </>
  );
}

export async function getServerSideProps(ctx): Promise<GetServerSidePropsResult<any>> {
  const { res } = ctx;
  const headers = getCookie(ctx);
  const heartBeat = await getHeartBeatGql(headers);
  const { sessionState, userName } = heartBeat;

  /*Redirect to login page when user do hard navigation or session has expired*/
  if (sessionState !== 'FULL_AUTH') {
    res.setHeader('location', '/login');
    res.statusCode = 302;
    res.end();
    return {
      props: {}
    };
  }

  return {
    props: { userName }
  };
}

export { DefaultAddressComponent, DefaultPaymentComponent };
