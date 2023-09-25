import { GetServerSideProps } from 'next/types';
import Breadcrumb from '@Components/breadcrumb/breadcrumb';
import { getContentPage } from '@Lib/cms/contentPage';
import { ContentPageMainSection } from '@Components/common/contentPageComponents';
import { extractContentPageDetails } from '@Lib/common/utility';
import HeroBanner from '@Components/homepage/heroBanner';
import CfStyles from '@Styles/customFraming/customFraming.module.scss';


import { ContentPage } from '@Types/cms/schema/contentPage.schema';

export default function CustomFraming({
  breadcrumbs, contentImageSection, mainSection
}) {

  return (
    <div className={CfStyles.customFraming}>
      <Breadcrumb breadCrumbs={breadcrumbs} />
      <ContentPageMainSection mainSection={mainSection} />
      {contentImageSection?.map(e =>
        <HeroBanner image={e} showCopyContents={false} />
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const deliveryKey = 'custom-framing';
  const { contentPage }: { contentPage: ContentPage } = await getContentPage(deliveryKey);

  /* TODO: Move the logic of extractContentPageDetails into the getContentPage method in the lib/cms/contentPage.
Refactor other content page instances to utilize this method to eliminate code duplication across the pages. */
  const extractedPageDetails = extractContentPageDetails(contentPage);

  return {
    props: extractedPageDetails
  };
};
