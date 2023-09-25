import { SyntheticEvent } from 'react';

import styles from '@Styles/productDetailPage/reviewAndQA/questions.module.scss';
import QuestionSlot from './questionSlot';

export default function Questions({ questions }): JSX.Element {
  function handleAskAQuestion(e: SyntheticEvent) {}
  function handleLoadQuestions(e: SyntheticEvent) {}

  return (
    <div className={styles.questions}>
      {questions.map((question, index: number) => (
        <QuestionSlot question={question} key={index} />
      ))}
      <button onClick={handleAskAQuestion}>Ask a question</button>
      <button onClick={handleLoadQuestions}>Load more questions</button>
    </div>
  );
}
