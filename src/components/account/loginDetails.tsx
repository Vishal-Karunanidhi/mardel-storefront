import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Divider } from '@mui/material';
import EditPassword from '@Components/account/editPassword';
import UpdateUser from '@Components/account/updateUser';
import { useDispatch, useSelector } from '@Redux/store';
import { loginDetailsData } from '@Constants/my-account/loginDetailsConstants';
import { getMyAccountContent } from '@Lib/cms/accountpage';
import { phoneNumberMask, formatMobileNumber, titleCase } from '@Lib/common/utility';
import MyAccountStyles from '@Styles/my-account/myAccount.module.scss';
import LoginStyles from '@Styles/account/loginDetails.module.scss';

export default function LoginDetails(props: any): JSX.Element {
  const router = useRouter();
  const dispatch = useDispatch();
  const { helperText, phoneNumber } = useSelector((state) => state.myAccount);
  const [currentView, setCurrentView] = useState('LOGIN_DETAILS');
  const { myProfileInfo } = useSelector((state) => state.auth);
  const { isInitialLoading } = useSelector((state) => state.layout.spinnerData);

  useEffect(() => {
    async function getAccountCmsData() {
      const myAccountData = await getMyAccountContent();
      dispatch({
        type: 'UPDATE_MYACCOUNT_CONTENT',
        payload: myAccountData
      });
      dispatch({
        type: 'LOAD_SPINNER',
        payload: {
          isVisible: false,
          className: '',
          isInitialLoading: false
        }
      });
    }
    getAccountCmsData();
  }, []);

  useEffect(() => {
    const hashArray = router?.asPath?.split('#');
    if (hashArray.includes('editEmail')) {
      setCurrentView('EMAIL');
    } else if (hashArray.includes('editPhone')) {
      setCurrentView('PHONE');
    } else if (hashArray.includes('editPassword')) {
      setCurrentView('PASSWORD');
    } else {
      setCurrentView('LOGIN_DETAILS');
    }
  }, [router?.asPath]);

  loginDetailsData.map((data) => {
    if (data.key === 'email') {
      data.value = myProfileInfo.email;
    }
    if (data.key === 'phone') {
      data.value = myProfileInfo.phone;
    }
    return data;
  });

  const showEditForm = (e: any) => {
    const { id } = e.target;
    setCurrentView(id?.toUpperCase());
    router.push({ hash: `loginDetails#edit${titleCase(id)}` });
  };

  const editCallBack = () => {
    setCurrentView('LOGIN_DETAILS');
    router.push({ hash: 'loginDetails' });
  };

  if (isInitialLoading) {
    return <div className={MyAccountStyles.divIsInitialLoading} />;
  }

  const LoginDetails = () => {
    return (
      <>
        <h2 className={LoginStyles.loginHeader}>Login Details</h2>
        <div className={LoginStyles.loginDetailSection}>
          {loginDetailsData?.map((data, i) => (
            <div key={i + data?.key}>
              <span className={LoginStyles.detailCompSeparator}>
                <span className={LoginStyles.detailLabelValue}>
                  <label className={LoginStyles.detailLabel}>{data.label}</label>
                  {data.key === 'phone' ? (
                    <p className={LoginStyles.detailValue}>{phoneNumberMask(data.value)}</p>
                  ) : (
                    <p className={LoginStyles.detailValue}>{data.value}</p>
                  )}
                </span>
                <span className={LoginStyles.editButton}>
                  <img
                    id={data.key}
                    alt="Edit"
                    height={18}
                    onClick={showEditForm}
                    src="icons/account/edit.svg"
                    width={18}
                  />
                </span>
              </span>
              <Divider className={LoginStyles.loginDivider} />
            </div>
          ))}
        </div>

        <p className={LoginStyles.mobileDetailsEnquiry}>
          {helperText} <a href={`tel:${phoneNumber}`}>{formatMobileNumber(phoneNumber)}</a>
        </p>
      </>
    );
  };

  let renderCurrentView = <></>;
  switch (currentView) {
    case 'LOGIN_DETAILS':
      renderCurrentView = <LoginDetails />;
      break;
    case 'EMAIL':
    case 'PHONE':
      renderCurrentView = <UpdateUser editCallBack={editCallBack} currentView={currentView} />;
      break;
    case 'PASSWORD':
      renderCurrentView = <EditPassword editCallBack={editCallBack} currentView={currentView} />;
      break;
  }

  return <div className={LoginStyles.loginSection}>{renderCurrentView}</div>;
}
