import { useEffect, useRef } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import Divider from '@mui/material/Divider';
import { logoutUser } from '@Lib/cms/accountpage';
import { useSelector } from '@Redux/store';
import EmailSubscription from '@Components/layout/emailSubscription';
import HeaderSignUpMobileCompStyles from '@Styles/layout/headerSignUpMobileComp.module.scss';
import { useRouter } from 'next/router';
import HeaderSignUpStyles from '@Styles/layout/headerAccountSignup.module.scss';

export default function HeaderSignUpMobileComponent(props: any): JSX.Element {
  const { handleSignupCloseModal } = props;

  const { heartBeatInfo } = useSelector((state: { auth: any }) => state.auth);

  const { firstName } = heartBeatInfo;
  const router = useRouter();
  const divRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (divRef.current && !divRef.current.contains(event.target)) {
        handleSignupCloseModal();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderSignUpMobilePopOver = () => {
    return (
      <div className={HeaderSignUpMobileCompStyles.headerSignUpMobile}>
        <div className={HeaderSignUpMobileCompStyles.modalHeaderSection}>
          <IconButton
            className={HeaderSignUpMobileCompStyles.iconButton}
            onClick={handleSignupCloseModal}
          >
            <CloseIcon className={HeaderSignUpMobileCompStyles.icon} />
          </IconButton>
        </div>
        <div className={HeaderSignUpMobileCompStyles.emailWrapper}>
          <EmailSubscription />
        </div>
        <Divider className={HeaderSignUpMobileCompStyles.popoverDivider} />
        <div className={HeaderSignUpMobileCompStyles.popoverFooterSection}>
          <span className={HeaderSignUpMobileCompStyles.accountAndIcon}>
            <AccountCircleOutlinedIcon className={HeaderSignUpMobileCompStyles.icon} />
            <a className={HeaderSignUpMobileCompStyles.registerLabel} href="/login">
              Register an account
            </a>
          </span>
          <label className={HeaderSignUpMobileCompStyles.alreadyRegisterLabel}>
            Already registered?{' '}
            <a className={HeaderSignUpMobileCompStyles.loginLabel} href="/login">
              Log in
            </a>
          </label>
        </div>
      </div>
    );
  };

  const renderLoggedInMobilePopOver = () => {
    return (
      <div className={HeaderSignUpMobileCompStyles.headerSignUpMobile} ref={divRef}>
        <div className={HeaderSignUpMobileCompStyles.modalHeaderSection}>
          <IconButton
            className={HeaderSignUpMobileCompStyles.iconButton}
            onClick={handleSignupCloseModal}
          >
            <CloseIcon className={HeaderSignUpMobileCompStyles.icon} />
          </IconButton>
        </div>

        <section className={HeaderSignUpStyles.loggedInContainer}>
          <h2 className={HeaderSignUpStyles.loggedInTitle}>
            {firstName != undefined && `Hi, ${firstName}`}
            {firstName == undefined && 'Welcome'}
          </h2>
          <ul className={HeaderSignUpStyles.loggedInList}>
            <li className={HeaderSignUpStyles.loggedInListAccount}>
              <a
                onClick={() => {
                  router.push({ pathname: '/my-account', hash: 'accountOverview' });
                  handleSignupCloseModal();
                }}
              >
                My Account
              </a>
            </li>
            <li className={HeaderSignUpStyles.loggedInListHistory}>
              <a
                onClick={() => {
                  router.push({ pathname: '/my-account', hash: 'orderHistory' });
                  handleSignupCloseModal();
                }}
              >
                Order History
              </a>
            </li>
            <li className={HeaderSignUpStyles.loggedInWishList}>
              <a
                onClick={() => {
                  router.push({ pathname: '/my-account', hash: 'lists' });
                  handleSignupCloseModal();
                }}
              >
                Shopping Lists
              </a>
            </li>
          </ul>
          <p className={HeaderSignUpStyles.loggedInSignOut}>
            <a href="/logout" onClick={() => logoutUser({})}>
              Log out
            </a>
          </p>
        </section>
      </div>
    );
  };

  return (
    <>
      {!heartBeatInfo.isLoggedInUser && renderSignUpMobilePopOver()}
      {heartBeatInfo.isLoggedInUser && renderLoggedInMobilePopOver()}
    </>
  );
}
