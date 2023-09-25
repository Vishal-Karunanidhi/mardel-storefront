import Breadcrumb from '@Components/breadcrumb/breadcrumb';
import EmailComponent from '@Components/account/emailComponent';
import { breadCrumbs } from '@Constants/accountConstants';
import { contentToBreadcrumb } from '@Lib/common/utility';

import PasswordStyles from '@Styles/account/forgotPassword.module.scss';

export default function ForgotPassword(): JSX.Element {
  return (
    <>
      <Breadcrumb breadCrumbs={contentToBreadcrumb(breadCrumbs)} />
      <div className={PasswordStyles.forgotPassword}>
        <span className={PasswordStyles.title}>Forgot Your Password?</span>
        <EmailComponent />
      </div>
    </>
  );
}
