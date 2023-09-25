import Breadcrumb from '@Components/breadcrumb/breadcrumb';
import { getContentPage } from '@Lib/cms/contentPage';
import { contentToBreadcrumb } from '@Lib/common/utility';
import {
  ContentComponent,
  ContentMainSection,
  ContentPage,
  ContentPageBreadcrumb
} from '@Types/cms/schema/contentPage.schema';
import { BreadCrumb } from '@Types/cms/schema/pdp/pdpData.schema';
import { GetServerSideProps } from 'next/types';
import styles from '@Styles/contentPage/privacyAndTerms.module.scss';
import AccordionSlot from '@Components/productDetailPage/accordianSlot';

type Props = {
  breadcrumbs: ContentPageBreadcrumb;
  mainSection: ContentMainSection[];
};

//showdown extension
let cookieBannerExtension = {
  type: 'lang',
  regex: /{show-cookie-banner text=["”]([A-Za-z ]+)["”]}/g,
  replace:
    '<a title="show cookie preferences" class="cookie-preferences optanon-toggle-display cookie-settings-button" style="cursor:pointer">$1</a>'
};

export default function PrivacyAndTerms({ breadcrumbs, mainSection }: Props) {
  const crumbs: BreadCrumb[] = contentToBreadcrumb(breadcrumbs);
  return (
    <div className={styles.privacyAndTerms}>
      <Breadcrumb breadCrumbs={crumbs} />
      <div className={styles.privacyAndTermsMainSection}>
        {mainSection.map((section: ContentMainSection, index: number) => {
          return (
            <AccordionSlot
              key={index}
              title={section.title}
              content={section.richText}
              contentStyle={{ margin: 0 }}
              markdownExtension={[cookieBannerExtension]}
            />
          );
        })}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { contentPage }: { contentPage: ContentPage } = await getContentPage('privacy-and-terms');
  let breadcrumbs: ContentPageBreadcrumb;
  let mainSection: ContentMainSection[] = [];

  contentPage.content.forEach((contentComponent: ContentComponent) => {
    switch (contentComponent.__typename) {
      case 'ContentPageBreadcrumb':
        breadcrumbs = contentComponent;
        break;
      case 'ContentMainSection':
        mainSection.push(contentComponent);
        break;
      default:
        break;
    }
  });

  return {
    props: {
      breadcrumbs,
      mainSection
    }
  };
};
