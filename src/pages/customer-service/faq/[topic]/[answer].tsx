import { contentToBreadcrumb, urlFriendly } from '@Lib/common/utility';
import { GetServerSideProps } from 'next/types';
import { ReactNode } from 'react';
import MarkdownView from 'react-showdown';
import { ShowdownExtension } from 'showdown';
import Breadcrumb from '@Components/breadcrumb/breadcrumb';

import { FaqPage, Questions, Topics } from '@Types/cms/faq';
import { getFaqPage } from '@Lib/cms/faq';
import styles from '@Styles/contentPage/faq.module.scss';

export default function FAQ({ breadcrumbs, ctaPanel, filteredAnswer, leftoverAnswers }) {
  const content: string | ReactNode = '';
  const markdownExtension: ShowdownExtension[] = [];

  // The question and answer combo card
  const faqAnswer = (
    <article className={`${styles.topic} ${styles.answer}`}>
      <h2>{filteredAnswer?.question}</h2>
      {typeof content == 'string' ? (
        <MarkdownView
          options={{ tables: true, emoji: true }}
          markdown={filteredAnswer?.answer}
          extensions={markdownExtension}
        />
      ) : (
        filteredAnswer?.answer
      )}
    </article>
  );

  // Sidebar with the other questions in the selected topic
  const faqRelated = (
    <aside className={styles.tertiary}>
      <p>
        <a href={ctaPanel.cta.value}>Contact Us</a>
      </p>
      {leftoverAnswers.length > 0 && (
        <section className={styles.related}>
          <h3>Related Questions</h3>
          <ul>
            {leftoverAnswers.map(
              (questionList: { question: { toString: () => string } }, index: number) => {
                let questionLink = urlFriendly(questionList.question.toString());
                return (
                  <li key={index}>
                    <a href={`${questionLink}`}>{questionList.question.toString()}</a>
                  </li>
                );
              }
            )}
          </ul>
        </section>
      )}
    </aside>
  );

  // Return everything in a structure, but first present an error if no answer matches the URL
  if (filteredAnswer === null) {
    return (
      <section className={`${styles.body} ${styles.secondary}`}>
        <div className={styles.topicsContainer}>
          <article className={`${styles.topic} ${styles.error}`}>
            <h2>Error</h2>
            <p>
              No FAQ topics match your request. Please return to the <a href="..">FAQ home page</a>{' '}
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
          <div className={styles.topicsContainer}>{faqAnswer}</div>
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

  // This looks through the answers in the topics sent, finds a match, and pulls it out
  let filteredAnswer = topics
    .map(function (topics: Topics) {
      return topics.questions.filter(
        (questions: Questions) => query.answer === urlFriendly(questions.question)
      );
    })
    .flat(3)
    .pop();

  // These are all the questions that the filter above rejected
  let leftoverAnswers = filteredTopic
    .map(function (topics: Topics) {
      return topics.questions.filter(
        (questions: Questions) => query.answer != urlFriendly(questions.question)
      );
    })
    .flat(2);

  // This takes the filtered topic and question and shoves them into the breadcrumbs
  let newBreadcrumbs = contentToBreadcrumb(breadcrumbs);
  let topicCrumb = {
    openInNewTab: false,
    __typename: 'LinkWithLabel',
    name: filteredTopic[0]?.topicName,
    key: `${breadcrumbs.links[2].value}/${query.topic}`,
    slug: `${breadcrumbs.links[2].value}/${query.topic}`
  };
  let answerCrumb = {
    openInNewTab: false,
    __typename: 'LinkWithLabel',
    name: 'Answer',
    key: '/',
    slug: '/'
  };
  newBreadcrumbs.push(topicCrumb, answerCrumb);

  return {
    props: {
      breadcrumbs: newBreadcrumbs,
      ctaPanel,
      header,
      topic: query.topic,
      answer: query.answer,
      filteredTopic,
      filteredAnswer: filteredAnswer || null,
      leftoverAnswers
    }
  };
};
