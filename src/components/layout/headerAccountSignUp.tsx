import { logoutUser } from '@Lib/cms/accountpage';
import { useSelector, useDispatch } from '@Redux/store';
import { useState } from 'react';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ArrowDropDownOutlinedIcon from '@mui/icons-material/ArrowDropDownOutlined';
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';
import EmailSubscription from '@Components/layout/emailSubscription';
import HeaderSignUpStyles from '@Styles/layout/headerAccountSignup.module.scss';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import { useRouter } from 'next/router';

export default function HeaderAccountSignUp(): JSX.Element {
  const [headerAccountAnchor, setHeaderAccountAnchor] = useState<HTMLButtonElement | null>(null);
  const { heartBeatInfo } = useSelector((state: { auth: any }) => state.auth);
  const { firstName } = heartBeatInfo;
  const router = useRouter();
  const dispatch = useDispatch();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setHeaderAccountAnchor(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setHeaderAccountAnchor(null);
    dispatch({
      type: 'ACCOUNT_VIEW_ORDER_FLAG',
      payload: {
        showOrderFullDetails: false,
        orderDetails: {}
      }
    });

    dispatch({
      type: 'UPDATE_CURRENT_LIST',
      payload: {}
    });
  };

  const open = Boolean(headerAccountAnchor);
  const id = open ? 'simple-popover' : undefined;

  const renderSignUpPopOver = () => {
    return (
      <>
        <Popover
          id={id}
          open={open}
          anchorEl={headerAccountAnchor}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          PaperProps={{
            className: HeaderSignUpStyles.popoverPaperProps
          }}
        >
          <div className={HeaderSignUpStyles.popoverWrapper}>
            <div className={HeaderSignUpStyles.popoverHeader}>
              <IconButton
                className={HeaderSignUpStyles.headerIconButton}
                onClick={handlePopoverClose}
                data-testid="signup-close"
              >
                <CloseIcon className={HeaderSignUpStyles.closeIcon} />
              </IconButton>
            </div>

            <EmailSubscription />
            <Divider className={HeaderSignUpStyles.popoverDivider} />
            <div>
              <span className={HeaderSignUpStyles.popoverFooterSection}>
                <span className={HeaderSignUpStyles.accountAndIcon}>
                  <AccountCircleOutlinedIcon className={HeaderSignUpStyles.icon} />
                  <a
                    className={HeaderSignUpStyles.registerLabel}
                    href="/login"
                    data-testid="signup-register"
                  >
                    Register an account
                  </a>
                </span>
                <label className={HeaderSignUpStyles.alreadyRegisterLabel}>
                  Already registered?{' '}
                  <a
                    className={HeaderSignUpStyles.loginLabel}
                    href="/login"
                    data-testid="signup-already-registered"
                  >
                    Log in
                  </a>
                </label>
              </span>
            </div>
          </div>
        </Popover>
      </>
    );
  };

  const renderLoggedInPopOver = () => {
    return (
      <Popover
        id={id}
        open={open}
        anchorEl={headerAccountAnchor}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{
          className: HeaderSignUpStyles.popoverPaperProps + ' ' + HeaderSignUpStyles.loggedIn
        }}
      >
        <article className={HeaderSignUpStyles.popoverWrapper}>
          <div className={HeaderSignUpStyles.popoverHeader}>
            <IconButton
              className={HeaderSignUpStyles.headerIconButton}
              onClick={handlePopoverClose}
              data-testid="signup-close"
            >
              <CloseIcon className={HeaderSignUpStyles.closeIcon} />
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
                    handlePopoverClose();
                  }}
                >
                  My Account
                </a>
              </li>
              <li className={HeaderSignUpStyles.loggedInListHistory}>
                <a
                  onClick={() => {
                    router.push({ pathname: '/my-account', hash: 'orderHistory' });
                    handlePopoverClose();
                  }}
                >
                  Order History
                </a>
              </li>
              <li className={HeaderSignUpStyles.loggedInWishList}>
                <a
                  onClick={() => {
                    router.push({ pathname: '/my-account', hash: 'lists' });
                    handlePopoverClose();
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
        </article>
      </Popover>
    );
  };

  return (
    <>
      <div className={HeaderSignUpStyles.headerAccountMain}>
        <span
          className={
            heartBeatInfo.isLoggedInUser
              ? HeaderSignUpStyles.accountIcon
              : HeaderSignUpStyles.accountIcon + ' ' + HeaderSignUpStyles.accountProfile
          }
        >
          <AccountCircleOutlinedIcon />
        </span>
        <span className={HeaderSignUpStyles.accountSelectBox}>
          <span className={HeaderSignUpStyles.signUpSaveLabel}>
            {(heartBeatInfo.isLoggedInUser && (
              <>
                {firstName != undefined && `Hi, ${firstName}`}
                {firstName == undefined && 'Welcome'}
              </>
            )) || <>Sign up and save</>}
          </span>
          <div className={HeaderSignUpStyles.emailAccountWrapper}>
            <span
              aria-describedby={id}
              aria-label="email sign up and account modal toggle"
              className={HeaderSignUpStyles.modalToggle}
              data-testid="email-account-modal"
              onClick={handleClick}
            >
              <span className={HeaderSignUpStyles.emailAccountLabel}>Email & Account</span>
              <IconButton className={HeaderSignUpStyles.arrowButton} disableRipple>
                <ArrowDropDownOutlinedIcon className={HeaderSignUpStyles.arrowIcon} />
              </IconButton>
            </span>
            {heartBeatInfo.isLoggedInUser === false && renderSignUpPopOver()}
            {heartBeatInfo.isLoggedInUser === true && renderLoggedInPopOver()}
          </div>
        </span>
      </div>
    </>
  );
}
