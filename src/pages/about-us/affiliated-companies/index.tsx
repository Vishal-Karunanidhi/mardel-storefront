import Breadcrumb from '@Components/breadcrumb/breadcrumb';
import { getContentPage } from '@Lib/cms/contentPage';
import {
  ContentComponent,
  ContentMainSection,
  ContentPage,
  ContentPageBreadcrumb
} from '@Types/cms/schema/contentPage.schema';
import { BreadCrumb } from '@Types/cms/schema/pdp/pdpData.schema';
import { GetServerSideProps } from 'next/types';
import MarkdownView from 'react-showdown';
import styles from '@Styles/contentPage/affiliatedCompanies.module.scss';
import { contentToBreadcrumb } from '@Lib/common/utility';

type Props = {
  breadcrumbs: ContentPageBreadcrumb;
  mainSection: ContentMainSection;
};

export default function AffiliatedCompanies({ breadcrumbs, mainSection }: Props) {
  const crumbs: BreadCrumb[] = contentToBreadcrumb(breadcrumbs);

  return (
    <div className={styles.affiliatedCompanies}>
      <Breadcrumb breadCrumbs={crumbs} />
      <div className={styles.affiliatedCompaniesBody}>
        <p className={styles.affiliatedCompaniesBodyHead}>{mainSection.title}</p>
        <MarkdownView
          className={styles.affiliatedCompaniesBodyRichText}
          markdown={mainSection.richText}
        />
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { contentPage }: { contentPage: ContentPage } = await getContentPage(
    'about-us/affiliated-companies'
  );
  let breadcrumbs: ContentPageBreadcrumb;
  let mainSection: ContentMainSection;

  contentPage.content.forEach((contentComponent: ContentComponent) => {
    switch (contentComponent.__typename) {
      case 'ContentPageBreadcrumb':
        breadcrumbs = contentComponent;
        break;
      case 'ContentMainSection':
        mainSection = contentComponent;
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
