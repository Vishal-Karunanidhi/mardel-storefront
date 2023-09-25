import { viewShoppingList } from '@Lib/cms/shoppingList';
import List from '@Components/account/list';
import { GetServerSidePropsResult } from 'next';
import { GtmDataLayer } from 'src/interfaces/gtmDataLayer';
import DataLayer from '@Utils/DataLayer';
import { getCookieData } from '@Lib/common/serverUtility';

export default function SharedList({ sharedListData, shoppingListUrl, gtmDataLayer }) {
  return (
    <>
      <div>
        <List {...sharedListData} isShared={true} />
      </div>
      <DataLayer pageData={gtmDataLayer} />
    </>
  );
}

export async function getServerSideProps(ctx): Promise<GetServerSidePropsResult<any>> {
  const { query } = ctx;

  const viewList = await viewShoppingList(query?.shoppingListUrl);

  const gtmDataLayer: GtmDataLayer = {
    anonymousUserId: getCookieData('hl-anon-id', ctx).toString(),
    event: 'page_view',
    pageType: 'wishlist'
  };

  return {
    props: { sharedListData: viewList, shoppingListUrl: query?.shoppingListUrl, gtmDataLayer }
  };
}
