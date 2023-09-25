import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from '@Redux/store';
import { Divider } from '@mui/material';
import LatestOrder from '@Components/account/latestOrder';
import { DefaultAddressComponent, DefaultPaymentComponent } from '@Pages/my-account';
import { logoutUser } from '@Lib/cms/accountpage';
import { DateMonthYearConverter } from '@Components/common/accountValidator';
import { spinnerEnd } from '@Utils/spinnerUtil';
import accountOverViewStyles from '@Styles/account/accountOverView.module.scss';
import MyAccountStyles from '@Styles/my-account/myAccount.module.scss';

const RenderProfileDetails = () => {
  const { myProfileInfo } = useSelector((state) => state.auth);
  const { firstName = '', lastName = '', createdAt } = myProfileInfo;

  const { year } = DateMonthYearConverter(createdAt);

  return (
    <>
      <div className={accountOverViewStyles.profileSection}>
        <img
          alt="Your Profile Picture"
          aria-hidden="true"
          height="100"
          src="/icons/account/accountProfileBlue.svg"
          width="100"
        ></img>
        <span className={accountOverViewStyles.profileDetails}>
          <span className={accountOverViewStyles.profileName}>
            {firstName != '' && 'Welcome back, ' + firstName + ' ' + lastName}
            {firstName == '' && 'Welcome back to your account'}
          </span>
          {!isNaN(year) && (
            <span
              className={accountOverViewStyles.profileJoinedYear}
            >{`Active member since ${year}`}</span>
          )}
          <span className={accountOverViewStyles.profileLogout}>
            Not you?{' '}
            <a href="/logout" onClick={() => logoutUser({})}>
              Log out
            </a>
          </span>
        </span>
      </div>
      <Divider className={accountOverViewStyles.sectionDivider} />
    </>
  );
};

const RenderAddressBook = () => {
  return (
    <div className={accountOverViewStyles.addressBookSection}>
      <span className={accountOverViewStyles.addressSection}>
        <DefaultAddressComponent
          headerComp={
            <>
              <span className={accountOverViewStyles.addressTitle}>Your address book</span>
              <span className={accountOverViewStyles.defaultAddress}>Default shipping address</span>
            </>
          }
        />
      </span>
      <Divider className={accountOverViewStyles.sectionDivider} />
      <span className={accountOverViewStyles.paymentSection}>
        <DefaultPaymentComponent
          headerComp={
            <>
              <span className={accountOverViewStyles.paymentTitle}>Your wallet</span>
              <span className={accountOverViewStyles.defaultPayment}>Default payment option</span>
            </>
          }
        />
      </span>
    </div>
  );
};

export default function AccountOverView(props: any): JSX.Element {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isInitialLoading, isMenuClicked } = useSelector((state) => state.layout.spinnerData);
  useEffect(() => {
    if (isMenuClicked) {
      dispatch(spinnerEnd);
    }
  }, [router?.asPath]);

  if (isInitialLoading) {
    return <div className={MyAccountStyles.divIsInitialLoading} />;
  }
  return (
    <div className={accountOverViewStyles.accountOverview}>
      <RenderProfileDetails />
      <LatestOrder />
      <RenderAddressBook />
    </div>
  );
}
