import { contentToBreadcrumb, urlFriendly } from '@Lib/common/utility';
import { GetServerSideProps } from 'next/types';
import Breadcrumb from '@Components/breadcrumb/breadcrumb';
import { FaqPage, Questions, Topics } from '@Types/cms/faq';
import { getFaqPage } from '@Lib/cms/faq';
import styles from '@Styles/contentPage/faq.module.scss';

export default function FAQ({ breadcrumbs, ctaPanel, filteredTopic, leftoverTopics }) {
  // I separated all the methods from their final return statement to make the page easier to understand
  // Comments have been added to each section as a brief explanation of their purpose
  // These methods aren't used anywhere else so should be able to stay here without further need for abstraction

  // FAQ topic selected by the URL
  const faqTopic = filteredTopic.map((topic: Topics, index: number) => {
    let topicLink = urlFriendly(topic.topicName);
    return (
      <article className={styles.topic} key={index}>
        <h2>{topic.topicName}</h2>
        <ul>
          {topic.questions.map((questionList: Questions, index: number) => {
            let questionLink = urlFriendly(questionList.question);
            return (
              <li key={index}>
                <a href={`${topicLink}/${questionLink}`}>{questionList.question}</a>
              </li>
            );
          })}
        </ul>
      </article>
    );
  });

  // Sidebar
  const faqRelated = (
    <aside className={styles.secondary}>
      <p>
        <a href={ctaPanel.cta.value}>Contact Us</a>
      </p>
      <section className={styles.related}>
        <h3>Related Topics</h3>
        {leftoverTopics.map((topic: Topics, index: number) => {
          let topicLink = urlFriendly(topic.topicName);
          return (
            <ul key={index}>
              <li>
                <a href={`${topicLink}`}>{topic.topicName}</a>
              </li>
            </ul>
          );
        })}
      </section>
    </aside>
  );

  // Return all the methods above, but first see if there's anything to show
  // If nothing is available, then return an error page
  if (filteredTopic.length === 0) {
    return (
      <section className={`${styles.body} ${styles.secondary}`}>
        <div className={styles.topicsContainer}>
          <article className={`${styles.topic} ${styles.error}`}>
            <h1>Error</h1>
            <p>
              No FAQ topics match your request. Please return to the <a href=".">FAQ home page</a>{' '}
              to view available topics.
            </p>
          </article>
        </div>
      </section>
    );
  } else {
    return (
      <>
        <Breadcrumb breadCrumbs={breadcrumbs} />
        <section className={`${styles.body} ${styles.secondary}`}>
          <div className={styles.topicsContainer}>{faqTopic}</div>
          {faqRelated}
        </section>
      </>
    );
  }
}

export const getServerSideProps: GetServerSideProps = async (context: { query: any }) => {
  const { breadcrumbs, ctaPanel, header, topics }: FaqPage = await getFaqPage(
    'customer-service/faq'
  );
  const { query } = context;

  // This looks through the topics sent, finds a match, and pulls it out
  const filteredTopic = topics.filter(
    (topics: Topics) => query.topic === urlFriendly(topics.topicName)
  );

  // These are all the topics that the filteredTopic method rejected
  const leftoverTopics = topics.filter(
    (topics: Topics) => query.topic != urlFriendly(topics.topicName)
  );

  // This takes the filtered topic and shoves it into the breadcrumbs
  let newBreadcrumbs = contentToBreadcrumb(breadcrumbs);
  let topicCrumb = {
    openInNewTab: false,
    __typename: 'LinkWithLabel',
    name: `${filteredTopic[0]?.topicName} Questions`,
    key: query.topic,
    slug: query.topic
  };
  newBreadcrumbs.push(topicCrumb);

  return {
    props: {
      breadcrumbs: newBreadcrumbs,
      ctaPanel,
      header,
      topic: query.topic,
      filteredTopic,
      leftoverTopics
    }
  };
};
