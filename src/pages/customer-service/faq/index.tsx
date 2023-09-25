import { BreadCrumb } from '@Types/cms/schema/pdp/pdpData.schema';
import { Card } from '@Types/cms/customerSupport';
import { contentToBreadcrumb, imageUrlQuery, urlFriendly } from '@Lib/common/utility';
import { GetServerSideProps } from 'next/types';
import Breadcrumb from '@Components/breadcrumb/breadcrumb';
import { FaqPage, Questions, Topics } from '@Types/cms/faq';
import { getFaqPage } from '@Lib/cms/faq';
import styles from '@Styles/contentPage/faq.module.scss';
import SeoHead from '@Components/common/seoHead';
import { NextSeo } from 'next-seo';
export default function FAQ({ breadcrumbs, ctaPanel, header, topics, metaData }) {
  const crumbs: BreadCrumb[] = contentToBreadcrumb(breadcrumbs);

  // The four cards at the top of the page
  const faqHeader = header.map((details: Card, index: number) => {
    return (
      <a className={styles.anchor} href={details.link.toString()} key={index}>
        <article>
          <div className={styles.container}>
            <img
              className={styles.image}
              src={imageUrlQuery(details.media.image.url, 300)}
              alt={details.media.imageAltText}
            />
          </div>
          <p className={styles.title} data-label={details.title}>
            {details.title}
          </p>
        </article>
      </a>
    );
  });

  // FAQ topics with questions, separated into cards
  const faqTopics = topics.map((topicList: Topics, index: number) => {
    // This takes the name of the topic and makes it URL-friendly
    let topicLink = urlFriendly(topicList.topicName);
    return (
      <article className={styles.topic} key={index}>
        <h2>
          <a href={`faq/${topicLink}/`}>{topicList.topicName}</a>
        </h2>
        <ul>
          {topicList.questions.map((questionList: Questions, index: number) => {
            // This makes the question URL-friendly
            let questionLink = urlFriendly(questionList.question);
            return (
              <li key={index}>
                <a href={`faq/${topicLink}/${questionLink}`}>{questionList.question}</a>
              </li>
            );
          })}
        </ul>
      </article>
    );
  });

  // Sidebar call to action
  const faqCTA = (
    <aside>
      <h3>{ctaPanel.title}</h3>
      <p>{ctaPanel.body}</p>
      <p>
        <a className={styles.button} href={ctaPanel.cta.value}>
          {ctaPanel.cta.label}
        </a>
      </p>
    </aside>
  );

  return (
    <>
      {metaData.title ? <SeoHead title={metaData.title}></SeoHead> : <></>}{' '}
      <NextSeo
        description={metaData.description}
        openGraph={{ images: [{ url: metaData.ogImage?.url }] }}
        additionalMetaTags={[{ content: metaData.keywords, property: 'keywords' }]}
      />
      <Breadcrumb breadCrumbs={crumbs} />
      <section className={styles.header}>{faqHeader}</section>
      <section className={styles.body}>
        <div className={styles.topicsContainer}>{faqTopics}</div>
        {faqCTA}
      </section>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { breadcrumbs, ctaPanel, header, topics, metaData }: FaqPage = await getFaqPage(
    'customer-service/faq'
  );

  return {
    props: {
      breadcrumbs,
      ctaPanel,
      header,
      topics,
      metaData
    }
  };
};
