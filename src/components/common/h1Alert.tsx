import React, { useState, useEffect } from 'react';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { useSelector } from '@Redux/store';
import {
  LOGGEDIN_USER,
  GUEST_USER,
  UNAUTHENTICATED_USER,
  SESSION_TIMEOUT_USER_CONST
} from '@Constants/sessionMsgConstants';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export interface State extends SnackbarOrigin {
  open: boolean;
}

export default function PositionedSnackbar() {
  const [sessionTimeoutUserType, setSessionTimeoutUserType] = useState('');
  const [isLoggedInUser, setIsLoggedInUser] = useState(false);
  const [snackbarPosition, setSnackbarPosition] = useState({
    top: '45%',
    background: '#ca312b'
  });
  const [snackBarProps, setSnackBarProps] = React.useState<State>({
    open: false,
    vertical: 'top',
    horizontal: 'center'
  });
  const { pageType } = useSelector((state) => state.layout);

  const { vertical, horizontal, open } = snackBarProps;

  useEffect(() => {
    window?.addEventListener('storage', () => {
      const { pathname } = window?.location;
      if (pathname?.indexOf('login') !== -1) {
        localStorage?.removeItem(SESSION_TIMEOUT_USER_CONST);
        return;
      }
      const sessionUserType = localStorage.getItem(SESSION_TIMEOUT_USER_CONST);
      if (sessionUserType) {
        let alertMessage = UNAUTHENTICATED_USER;
        if (sessionUserType === 'loggedInUser') {
          alertMessage = LOGGEDIN_USER;
        } else if (sessionUserType === 'guestUser') {
          alertMessage = GUEST_USER;
        }
        setSessionTimeoutUserType(alertMessage);
        if (sessionUserType === 'loggedInUser' || sessionUserType === 'unAuthenticatedUser') {
          setIsLoggedInUser(true);
          setSnackBarProps({ open: true, vertical: 'top', horizontal: 'center' });
        } else if (sessionUserType === 'guestUser') {
          setSnackbarPosition({ ...snackbarPosition, top: '0%', background: 'Orange' });
          setSnackBarProps({ open: true, vertical: 'top', horizontal: 'right' });
        }
      }
    });
  }, []);

  const handleClose = (event: any) => {
    setSnackBarProps({ ...snackBarProps, open: false });
    localStorage?.removeItem(SESSION_TIMEOUT_USER_CONST);
    if (isLoggedInUser) {
      window.location.href = '/login';
    } else if (pageType?.isCheckoutPage) {
      window.location.href = '/checkout';
    }
  };

  return (
    <>
      {sessionTimeoutUserType && (
        <div>
          <Snackbar
            ContentProps={{
              sx: {
                background: snackbarPosition?.background,
                marginTop: snackbarPosition?.top
              }
            }}
            anchorOrigin={{ vertical, horizontal }}
            key={vertical + horizontal}
            open={open}
            message={sessionTimeoutUserType}
            onClose={handleClose}
            action={
              <>
                <Button color="inherit" size="small" onClick={handleClose}>
                  Ok
                </Button>
              </>
            }
          />
        </div>
      )}
    </>
  );
}
