import Breadcrumb from '@Components/breadcrumb/breadcrumb';
import MarkdownView from 'react-showdown';
import { getContentPage } from '@Lib/cms/contentPage';
import { contentToBreadcrumb } from '@Lib/common/utility';
import {
  ContentComponent,
  ContentPage,
  ContentPageBreadcrumb,
  ContentRichText
} from '@Types/cms/schema/contentPage.schema';
import { BreadCrumb } from '@Types/cms/schema/pdp/pdpData.schema';
import { GetServerSideProps } from 'next/types';
import styles from '@Styles/contentPage/supplyChain.module.scss';

type Props = {
  breadcrumbs: ContentPageBreadcrumb;
  richText: ContentRichText;
};

export default function SupplyChain({ breadcrumbs, richText }: Props) {
  const crumbs: BreadCrumb[] = contentToBreadcrumb(breadcrumbs);
  return (
    <div className={styles.supplyChain}>
      <Breadcrumb breadCrumbs={crumbs} />
      <div className={styles.supplyChainText}>
        <MarkdownView options={{tables: true, emoji: true}} markdown={richText.richText} />
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { contentPage }: { contentPage: ContentPage } = await getContentPage(
    'customer-service/supply-chain'
  );
  let breadcrumbs: ContentPageBreadcrumb;
  let richText: ContentRichText;

  contentPage.content.forEach((contentComponent: ContentComponent) => {
    switch (contentComponent.__typename) {
      case 'ContentPageBreadcrumb':
        breadcrumbs = contentComponent;
        break;
      case 'ContentRichText':
        richText = contentComponent;
        break;
      default:
        break;
    }
  });

  return {
    props: {
      breadcrumbs,
      richText
    }
  };
};
