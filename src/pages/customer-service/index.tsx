import Breadcrumb from '@Components/breadcrumb/breadcrumb';
import { HlPageLinkButton } from '@Components/common/button';
import { getCustomerSupportPage } from '@Lib/cms/customerSupport';
import { contentToBreadcrumb, imageUrlQuery } from '@Lib/common/utility';
import { CustomerSupportPage } from '@Types/cms/customerSupport';
import { BreadCrumb } from '@Types/cms/schema/pdp/pdpData.schema';
import { GetServerSideProps } from 'next';
import styles from '@Styles/customerService/customerService.module.scss';
import ImageWithFallback from '@Components/common/imageWithFallback';

export default function CustomerService({ breadcrumbs, content }: CustomerSupportPage) {
  const crumbs: BreadCrumb[] = contentToBreadcrumb(breadcrumbs);

  return (
    <>
      <Breadcrumb breadCrumbs={crumbs} />
      <div className={styles.customerService}>
        {content.map((contentElement) => {
          switch (contentElement.__typename) {
            case 'Card':
              return (
                <article className={styles.customerServiceMediaCard}>
                  <ImageWithFallback
                    src={imageUrlQuery(contentElement.media.image.url, 411, 375)}
                  />
                </article>
              );
            case 'ContentCTA':
              return (
                <article className={styles.customerServiceCTACard}>
                  <h2 className={styles.customerServiceCTACardTitle}>{contentElement.title}</h2>
                  <p className={styles.customerServiceCTACardBody}>{contentElement.body}</p>
                  <div className={styles.customerServiceCTACardButton}>
                    <HlPageLinkButton
                      href={contentElement.cta.value}
                      buttonTitle={contentElement.cta.label}
                    />
                  </div>
                </article>
              );
          }
        })}
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { breadcrumbs, content }: CustomerSupportPage = await getCustomerSupportPage();

  return {
    props: {
      breadcrumbs,
      content
    }
  };
};
