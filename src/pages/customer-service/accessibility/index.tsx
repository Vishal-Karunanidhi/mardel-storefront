import Breadcrumb from '@Components/breadcrumb/breadcrumb';
import MarkdownView from 'react-showdown';
import { getContentPage } from '@Lib/cms/contentPage';
import { contentToBreadcrumb, imageUrlQuery } from '@Lib/common/utility';
import {
  ContentComponent,
  ContentCTA,
  ContentMainSection,
  ContentPage,
  ContentPageBreadcrumb
} from '@Types/cms/schema/contentPage.schema';
import { BreadCrumb } from '@Types/cms/schema/pdp/pdpData.schema';
import { GetServerSideProps } from 'next/types';
import styles from '@Styles/contentPage/accessibility.module.scss';
import { MediaImage } from '@Types/shared';
import { useState } from 'react';
import Link from 'next/link';

type Props = {
  breadcrumbs: ContentPageBreadcrumb;
  contentImage: MediaImage;
  contentCTA: ContentCTA;
  mainSections: ContentMainSection[];
};

export default function Accessibility({
  breadcrumbs,
  contentImage,
  contentCTA,
  mainSections
}: Props) {
  const [isFocused, setIsFocused] = useState(false);
  const divStyle = {
    outline: `dashed ${styles.hlBlueDark}`,
    outlineOffset: '5px'
  };

  const crumbs: BreadCrumb[] = contentToBreadcrumb(breadcrumbs);
  const sections: JSX.Element[] = mainSections.map((section, index) => (
    <div className={styles.accessibilityContentSection} key={index}>
      <h2 className={styles.accessibilityContentSectionTitle}>{section.title}</h2>
      <MarkdownView
        className={styles.accessibilityContentSectionBody}
        markdown={section.richText}
      />
    </div>
  ));
  const image: JSX.Element = (
    <picture>
      <source media="(min-width:768)" srcSet={imageUrlQuery(contentImage.url, 193, 173)} />
      <img src={imageUrlQuery(contentImage.url, 99, 89)} alt="Our Story Image" />
    </picture>
  );
  return (
    <div className={styles.accessibility}>
      <Breadcrumb breadCrumbs={crumbs} />
      <div className={styles.accessibilityContent}>
        <div className={styles.accessibilityContentSections}>{sections}</div>
        {image}
      </div>
      <section className={styles.accessibilityContactContainer}>
        <div className={styles.accessibilityContact}>
          <div className={styles.accessibilityContactTitle}>{contentCTA.title}</div>
          <div className={styles.accessibilityContactBody}>{contentCTA.body}</div>
          <div
            className={styles.accessibilityContactOutline}
            onPointerDown={(e) => e.preventDefault()}
            onPointerUp={(e) => e.preventDefault()}
            style={isFocused ? divStyle : {}}
          >
            <Link href={contentCTA.cta.value} passHref>
              <button
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onPointerDown={(e) => (e.currentTarget.style.background = styles.hlBlueLight)}
                onPointerUp={(e) => (e.currentTarget.style.background = styles.hlBlueDark)}
              >
                {contentCTA.cta.label}
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { contentPage }: { contentPage: ContentPage } = await getContentPage(
    'customer-service/accessibility'
  );
  let breadcrumbs: ContentPageBreadcrumb = null;
  let contentImage: MediaImage = null;
  let contentCTA: ContentCTA = null;
  let mainSections: ContentMainSection[] = [];

  contentPage.content.forEach((contentComponent: ContentComponent) => {
    switch (contentComponent.__typename) {
      case 'ContentPageBreadcrumb':
        breadcrumbs = contentComponent;
        break;
      case 'ContentPageImage':
        contentImage = contentComponent.ContentImage;
        break;
      case 'ContentCTA':
        contentCTA = contentComponent;
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
      contentCTA,
      mainSections
    }
  };
};
