import { GetServerSideProps } from 'next/types';
import Breadcrumb from '@Components/breadcrumb/breadcrumb';
import { ContentPageMainSection } from '@Components/common/contentPageComponents';
import { getContentPage } from '@Lib/cms/contentPage';
import { extractContentPageDetails } from '@Lib/common/utility';

import { ContentPage } from '@Types/cms/schema/contentPage.schema';

export default function ShippingAndReturns({
  extractedPageDetails: { breadcrumbs, mainSection }
}: any) {
  return (
    <div>
      <Breadcrumb breadCrumbs={breadcrumbs} />
      <ContentPageMainSection mainSection={mainSection} />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const path = context?.req?.url;
  const deliveryKey = path?.split('/').at(-1) ?? 'shipping-info-returns';
  const { contentPage }: { contentPage: ContentPage } = await getContentPage(deliveryKey);

  /* TODO: Move the logic of extractContentPageDetails into the getContentPage method in the lib/cms/contentPage.
Refactor other content page instances to utilize this method to eliminate code duplication across the pages. */
  const extractedPageDetails = extractContentPageDetails(contentPage);

  return {
    props: {
      extractedPageDetails
    }
  };
};
