import { BreadCrumb } from '@Types/cms/schema/pdp/pdpData.schema';
import { contentToBreadcrumb } from '@Lib/common/utility';
import { GetServerSideProps } from 'next/types';
import Breadcrumb from '@Components/breadcrumb/breadcrumb';

import {
  TemplateCard,
  TemplateCardBody,
  WeddingTemplatesContent
} from '@Types/cms/weddingTemplates';
import { getWeddingTemplatesPage } from '@Lib/cms/weddingTemplates';
import styles from '@Styles/contentPage/weddingTemplates.module.scss';

export default function Templates({ breadcrumbs, templatePageBody }) {
  const crumbs: BreadCrumb[] = contentToBreadcrumb(breadcrumbs);

  const templateCards = templatePageBody?.templateCard?.map(
    (templateCard: TemplateCard, index: number) => {
      {
        return (
          <article key={index}>
            <h2 className={styles.header}>{templateCard?.groupTitle}</h2>
            <section className={styles.body}>
              {templateCard?.templateCardBody?.map((details: TemplateCardBody, index: number) => {
                const imageUrl = details.templateImage.image.url.replace(/\s+/g, '%20');
                return (
                  <article className={styles.card} key={index}>
                    <p className={styles.imageContainer}>
                      <picture>
                        <source media="(min-width: 600px)" srcSet={`${imageUrl}?w=600`} />
                        <img
                          alt={details.templateImage.imageAltText}
                          srcSet={`${imageUrl}?w=300`}
                          height="300"
                          width="300"
                        ></img>
                      </picture>
                    </p>
                    <div className={styles.detailsContainer}>
                      <p className={styles.nameContainer}>{details.templateName}</p>
                      <p className={styles.skuContainer}>
                        {details.sku && (
                          <>
                            <strong>SKU:</strong> {details.sku}
                          </>
                        )}
                      </p>
                    </div>
                    <p className={styles.buttonContainer}>
                      {details.rsvpUrl && (
                        <a
                          href={details.rsvpUrl}
                          className={styles.button}
                          target="_blank"
                          rel="noreferrer"
                        >
                          RSVP
                        </a>
                      )}{' '}
                      {details.invitationUrl && (
                        <a
                          href={details.invitationUrl}
                          className={styles.button}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Invitation
                        </a>
                      )}{' '}
                      {details.templateUrl && (
                        <a
                          href={details.templateUrl}
                          className={styles.button}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Template
                        </a>
                      )}
                    </p>
                  </article>
                );
              })}
            </section>
          </article>
        );
      }
    }
  );

  return (
    <>
      <Breadcrumb breadCrumbs={crumbs} />
      {templateCards}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { breadcrumbs, templatePageBody }: WeddingTemplatesContent = await getWeddingTemplatesPage(
    'wedding-templates'
  );

  return {
    props: {
      breadcrumbs,
      templatePageBody
    }
  };
};
