import { GetServerSidePropsResult } from 'next/types';
import { getCookie, getCookieData } from '@Lib/common/serverUtility';
import { logoutUser } from '@Lib/cms/accountpage';
import DataLayer from '@Utils/DataLayer';
import { GtmDataLayer } from 'src/interfaces/gtmDataLayer';

export default function MyAccount(props: any): JSX.Element {
  return (
    <>
      <div></div>
      <DataLayer pageData={props.gtmData} />
    </>
  );
}

export async function getServerSideProps(ctx): Promise<GetServerSidePropsResult<any>> {
  const { res } = ctx;
  const headers = getCookie(ctx);
  const result = await logoutUser(headers);

  const gtmData: GtmDataLayer = {
    anonymousUserId: getCookieData('hl-anon-id', ctx).toString(),
    event: 'page_view',
    pageType: 'logoff'
  };

  /*Redirect to login page when user do hard navigation or session has expired*/
  const redirectionPath = result ? '/' : '/my-account';
  res.setHeader('location', redirectionPath);
  res.statusCode = 302;
  res.end();
  return {
    props: {
      gtmData
    }
  };
}
