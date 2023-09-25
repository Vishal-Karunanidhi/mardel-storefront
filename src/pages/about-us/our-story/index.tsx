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
import styles from '@Styles/contentPage/ourStory.module.scss';
import { contentToBreadcrumb, imageUrlQuery } from '@Lib/common/utility';
import { MediaImage } from '@Types/shared';

type Props = {
  breadcrumbs: ContentPageBreadcrumb;
  contentImage: MediaImage;
  mainSections: ContentMainSection[];
};

export default function AffiliatedCompanies({ breadcrumbs, contentImage, mainSections }: Props) {
  const crumbs: BreadCrumb[] = contentToBreadcrumb(breadcrumbs);
  const sections: JSX.Element[] = mainSections.map((section, index) => (
    <div className={styles.ourStorySection} key={index}>
      <h2 className={styles.ourStorySectionTitle}>{section.title}</h2>
      <MarkdownView
        options={{ tables: true, emoji: true }}
        className={styles.ourStorySectionBody}
        markdown={section.richText}
      />
    </div>
  ));

  return (
    <>
      <Breadcrumb breadCrumbs={crumbs} />
      <div className={styles.ourStory}>
        <picture>
          <source media="(min-width:1024px)" srcSet={imageUrlQuery(contentImage.url, 1280, 720)} />
          <source
            media="(min-width:768px) and (max-width:1023px)"
            srcSet={imageUrlQuery(contentImage.url, 725, 408)}
          />
          <img src={imageUrlQuery(contentImage.url, 320, 180)} alt="Our Story Image" />
        </picture>
        <div className={styles.ourStorySections}>{sections}</div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { contentPage }: { contentPage: ContentPage } = await getContentPage('about-us/our-story');
  let breadcrumbs: ContentPageBreadcrumb = null;
  let contentImage: MediaImage = null;
  let mainSections: ContentMainSection[] = [];

  contentPage.content.forEach((contentComponent: ContentComponent) => {
    switch (contentComponent.__typename) {
      case 'ContentPageBreadcrumb':
        breadcrumbs = contentComponent;
        break;
      case 'ContentPageImage':
        contentImage = contentComponent.ContentImage;
        break;
      case 'ContentMainSection':
        mainSections.push(contentComponent);
        break;
      default:
        break;
    }
  });

  return {
    props: {
      breadcrumbs,
      contentImage,
      mainSections
    }
  };
};
