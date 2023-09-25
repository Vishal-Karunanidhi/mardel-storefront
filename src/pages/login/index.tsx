import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from '@Redux/store';
import Breadcrumb from '@Components/breadcrumb/breadcrumb';
import SignIn from '@Components/account/signIn';
import SignUp from '@Components/account/signUp';
import { contentToBreadcrumb } from '@Lib/common/utility';
import { GetServerSidePropsResult } from 'next/types';
import { getCookie, getCookieData } from '@Lib/common/serverUtility';
import { getHeartBeatGql } from '@Lib/cms/accountpage';
import { breadCrumbs } from '@Constants/accountConstants';
import { SESSION_TIMEOUT_USER_CONST } from '@Constants/sessionMsgConstants';
import LoginStyles from '@Styles/account/account.module.scss';
import DataLayer from '@Utils/DataLayer';
import { GtmDataLayer } from 'src/interfaces/gtmDataLayer';

export default function Login(props: any): JSX.Element {
  const router = useRouter();
  const { heartBeatInfo } = useSelector((state) => state.auth);

  // redirects to homepage as logged in users shouldn't see this page
  if (heartBeatInfo.isLoggedInUser && heartBeatInfo?.sessionState === 'FULL_AUTH') {
    window.location.href = '/';
    return;
  }

  useEffect(() => {
    // is pathname allowed to be null?
    const pathname = router?.asPath?.split('#')?.[0];
    router.push({ pathname });
    window.localStorage.removeItem(SESSION_TIMEOUT_USER_CONST);
  }, []);

  return (
    <>
      <Breadcrumb breadCrumbs={contentToBreadcrumb(breadCrumbs)} />
      <div className={LoginStyles.accountPage}>
        <div className={LoginStyles.SignInform}>
          <SignIn />
        </div>
        <div className={LoginStyles.loginPageDivider}></div>
        <div className={LoginStyles.SignUpform}>
          <SignUp />
        </div>
      </div>
      <DataLayer pageData={props.gtmData} />
    </>
  );
}

export async function getServerSideProps(ctx): Promise<GetServerSidePropsResult<any>> {
  const { res } = ctx;
  const headers = getCookie(ctx);
  const heartBeat = await getHeartBeatGql(headers);
  const { sessionState, userName } = heartBeat;
  const gtmData: GtmDataLayer = {
    anonymousUserId: getCookieData('hl-anon-id', ctx).toString(),
    event: 'page_view',
    pageType: 'accountLogin'
  };

  /*Redirect to login page when user do hard navigation or session has expired*/
  if (sessionState === 'FULL_AUTH') {
    res.setHeader('location', '/');
    res.statusCode = 302;
    res.end();
    return {
      props: {}
    };
  }

  return {
    props: {
      gtmData,
      userName
    }
  };
}
