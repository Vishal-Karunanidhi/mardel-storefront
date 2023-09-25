import { BreadCrumb } from '@Types/cms/schema/pdp/pdpData.schema';
import { contentToBreadcrumb } from '@Lib/common/utility';
import { GetServerSideProps } from 'next/types';
import Breadcrumb from '@Components/breadcrumb/breadcrumb';
import MarkdownView from 'react-showdown';

import { RichTextPageContent } from '@Types/cms/richTextPage.schema';
import { getRichTextPage } from '@Lib/cms/richText';
import styles from '@Styles/richTextPage/richTextPage.module.scss';

export default function WeddingTemplates({ breadcrumbs, richText }) {
  const crumbs: BreadCrumb[] = contentToBreadcrumb(breadcrumbs);

  return (
    <>
      <Breadcrumb breadCrumbs={crumbs} />
      <section className={styles.body}>
        <MarkdownView options={{tables: true, emoji: true}} className={styles.content} markdown={richText} />
      </section>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { breadcrumbs, richText }: RichTextPageContent = await getRichTextPage(
    'wedding-template-instructions'
  );

  return {
    props: {
      breadcrumbs,
      richText
    }
  };
};
