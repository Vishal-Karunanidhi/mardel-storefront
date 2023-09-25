import { useState } from 'react';
import Paper from '@mui/material/Paper';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import CloseIcon from '@mui/icons-material/Close';
import FormControl from '@mui/material/FormControl';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import InputAdornment from '@mui/material/InputAdornment';
import client from '@Graphql/client';
import { gql } from '@apollo/client';
import SignupForEmails from '@GqlMutations/signUpSubscription.graphql';
import styles from '@Styles/layout/signUpSubscription.module.scss';
import { GtmDataLayer } from 'src/interfaces/gtmDataLayer';
import { useSelector } from '@Redux/store';
import { Ga4DataLayer } from 'src/interfaces/ga4DataLayer';
const VALIDATE_EMAIL_FORMAT = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

// Component inline Material styling using 'sx' prop is a shortcut for defining custom style
const componentMaterialStyle = {
  paperVariant: {
    backgroundColor: '#003087'
  },

  helperTextsx: {
    color: '#FFFFFF',
    fontSize: '14px',
    height: '25px',
    lineHeight: '16px'
  },

  papersx: {
    backgroundColor: '#003087',
    borderRadius: '17px 17px 0px 0px',
    height: '20px',
    outline: '#003087',
    outlineColor: '#003087',
    outlineOffset: '-3px',
    outlineStyle: 'solid',
    outlineWidth: '8px'
  },

  iconsx: {
    color: '#FFFFFF',
    cursor: 'pointer',
    float: 'right',
    height: '11.67px',
    marginBottom: '0px',
    marginRight: '-7px',
    marginTop: '-5px',
    width: '11.67px'
  }
};

export default function SignUpSubscription(props): JSX.Element {
  const {
    description,
    button,
    successMessageHeading,
    successMessage,
    errorMessageHeading,
    errorMessage
  } = props;
  const { papersx, iconsx, helperTextsx } = componentMaterialStyle;
  const [open, setOpen] = useState<boolean>(false);
  const [isDialog, setIsDialog] = useState<boolean>(true);
  const [emailName, setEmailName] = useState<string>('');
  const [emailTitle, setEmailTitle] = useState<boolean>(false);
  const [emailFormatError, setEmailFormatError] = useState<boolean>(false);
  const {
    heartBeatInfo: { sessionId, isLoggedInUser }
  } = useSelector((state) => state.auth);

  const handleEmailSignUp = async () => {
    const isValidMail = validateEmail(emailName);
    try {
      if (!isValidMail) {
        setEmailFormatError(true);
        return;
      }
      setEmailFormatError(false);
      const { data } = await client.mutate({
        mutation: gql`
          ${SignupForEmails}
        `,
        variables: {
          emailDataRequest: {
            email: emailName
          }
        },
        context: { clientName: 'BFF' }
      });
      if (data.signupForEmails.Message == 'Success') {
        if (window) {
          let gtmData: Ga4DataLayer = {
            anonymous_user_id: '',
            event: 'email_subscribe',
            user_id: ''
          };

          if (sessionId) {
            isLoggedInUser
              ? (gtmData.user_id = sessionId)
              : (gtmData.anonymous_user_id = sessionId);
          }

          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push(gtmData);
        }

        setIsDialog(true);
        setOpen(true);
      } else {
        setIsDialog(false);
        setOpen(true);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEmailName('');
    setEmailTitle(false);
  };

  const handleEmailChange = (email: string) => {
    setEmailName(email);
    setEmailFormatError(false);
    if (email !== '') {
      setEmailTitle(true);
    } else {
      setEmailTitle(false);
    }
  };

  const validateEmail = (input: string) => {
    if (input) {
      const result = VALIDATE_EMAIL_FORMAT.test(input);
      return result;
    }
  };

  function SignUpDialog(): JSX.Element {
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth={'xs'}
        PaperProps={{
          style: {
            borderRadius: '20px'
          }
        }}
      >
        <DialogTitle sx={papersx}>
          <CloseIcon sx={iconsx} onClick={handleClose} />
        </DialogTitle>
        <DialogTitle id="alert-dialog-title" className={styles.dialogTitleStyle}>
          {isDialog ? successMessageHeading : errorMessageHeading}
        </DialogTitle>
        <DialogContent className={styles.dialogContentStyle}>
          {isDialog ? successMessage : errorMessage}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Paper variant="outlined" square className={styles.signupCard}>
      <div className={styles.signupContainer}>
        <Typography className={styles.signupTitle}>{description}</Typography>
        <div className={styles.signupInputButtonContainer}>
          <FormControl fullWidth className={styles.signupInput} variant="filled">
            {emailTitle ? <InputLabel htmlFor="outlined-adornment-password">Email</InputLabel> : ''}
            <OutlinedInput
              className={styles.inputStyle}
              error={emailFormatError}
              value={emailName}
              placeholder={!emailTitle ? 'Email' : ''}
              inputProps={{ 'data-testid': 'email-signup-email-address' }}
              onChange={(event) => handleEmailChange(event.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  {emailFormatError ? <InfoOutlinedIcon sx={{ color: '#7E0000' }} /> : ''}
                </InputAdornment>
              }
            />
            <FormHelperText
              className={styles.fieldError}
              sx={helperTextsx}
              id="outlined-weight-helper-text"
            >
              {emailFormatError ? 'Incorrect email format' : ''}
            </FormHelperText>
          </FormControl>
          <Button
            variant="outlined"
            onClick={handleEmailSignUp}
            disableRipple
            className={styles.secondaryButton}
            data-testid="email-signup-confirm"
          >
            <span className={styles.spanButton}>{button}</span>
          </Button>
        </div>
      </div>
      <SignUpDialog />
    </Paper>
  );
}
