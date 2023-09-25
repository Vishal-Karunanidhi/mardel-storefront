import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useDispatch, useSelector } from '@Redux/store';
import { SESSION_TIMEOUT_USER_CONST } from '@Constants/sessionMsgConstants';

export default function HlSnackBar(props) {
  const dispatch = useDispatch();
  const {
    open,
    message,
    severity,
    duration = 5000
  } = useSelector((state) => state.layout.toasterData);

  let isessionErrorExists = false;
  if (typeof window !== 'undefined') {
    isessionErrorExists = !!window?.localStorage?.getItem(SESSION_TIMEOUT_USER_CONST);
  }

  const closeTheToaster = () => {
    dispatch({
      type: 'UPDATE_SNACKBAR_WITH_DATA',
      payload: {
        open: false,
        message: message,
        severity: severity
      }
    });
  };

  return (
    <Snackbar
      open={open && !isessionErrorExists}
      autoHideDuration={duration}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      onClose={closeTheToaster}
    >
      <MuiAlert onClose={closeTheToaster} severity={severity}>
        {message}
      </MuiAlert>
    </Snackbar>
  );
}
