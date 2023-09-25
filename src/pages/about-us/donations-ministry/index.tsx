import { getContentPage } from '@Lib/cms/contentPage';
import Breadcrumb from '@Components/breadcrumb/breadcrumb';
import {
  ContentComponent,
  ContentMainSection,
  ContentPage,
  ContentPageBreadcrumb,
  OrganizationList
} from '@Types/cms/schema/contentPage.schema';
import { imageURL } from '@Lib/common/utility';
import { contentToBreadcrumb, imageUrlQuery } from '@Lib/common/utility';
import { MediaImage } from '@Types/shared';
import MarkdownView from 'react-showdown';
import { GetServerSideProps } from 'next';
import styles from '@Styles/contentPage/donationsAndMinistry.module.scss';

type Props = {
  breadcrumbs: ContentPageBreadcrumb;
  contentImage: MediaImage;
  mainSections: ContentMainSection[];
  organizations: OrganizationList;
};

function DonationsMinistry({ breadcrumbs, contentImage, mainSections, organizations }: Props) {
  return (
    <div className={styles.donationsAndMinistryPage}>
      <div className={styles.breadCrumbsContainer}>
        <Breadcrumb breadCrumbs={contentToBreadcrumb(breadcrumbs)} />
      </div>
      <div className={styles.content}>
        <div className={styles.richTextContainer}>
          <h2 className={styles.titleMain}>{mainSections[0].title}</h2>
          <MarkdownView
            className={styles.ourStorySectionBody}
            markdown={mainSections[0].richText}
          />
        </div>
        <div className={styles.organizationsContainer}>
          <h2 className={styles.titleOrg}>{organizations.header}</h2>
          <div className={styles.organizations}>
            {organizations.organizations.map((org, index) => {
              return (
                <div key={index} className={styles.org}>
                  <div className={styles.orgImageContainer}>
                    {org.image && (
                      <img
                        alt={org.description}
                        src={imageURL(org.image.defaultHost, org.image.endpoint, org.image.name)}
                        className={styles.orgImage}
                      />
                    )}
                  </div>
                  <div className={styles.orgDescription}>{org.description}</div>
                  <div className={styles.orgDetails}>{org.details}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonationsMinistry;

export const getServerSideProps: GetServerSideProps = async () => {
  const { contentPage }: { contentPage: ContentPage } = await getContentPage(
    'about-us/donations-ministry'
  );
  let breadcrumbs: ContentPageBreadcrumb = null;
  let contentImage: MediaImage = null;
  let mainSections: ContentMainSection[] = [];
  let organizations: OrganizationList = null;

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
      case 'OrganizationList':
        organizations = contentComponent;
      default:
        break;
    }
  });

  return {
    props: {
      breadcrumbs,
      contentImage,
      mainSections,
      organizations
    }
  };
};
