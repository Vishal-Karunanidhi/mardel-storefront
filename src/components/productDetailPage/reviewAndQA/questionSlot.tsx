import { ChangeEvent, SyntheticEvent, useState } from 'react';
import styles from '@Styles/productDetailPage/reviewAndQA/questionSlot.module.scss';

export default function QuestionSlot({ question }): JSX.Element {
  const [numHelpful, setNumHelpful] = useState<number>(question.numHelpful);
  const [showAnswerBox, setShowAnswerBox] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string>();

  function markHelpful(): void {
    setNumHelpful(numHelpful + 1);
  }
  function submitAnswer(e: SyntheticEvent<HTMLFormElement>): void {
    e.preventDefault();
  }

  return (
    <div className={styles.question}>
      <div className={styles.questionTitle}>{question.title}</div>
      <div className={styles.questionSubSection}>
        <div className={styles.questionSubSectionAnswer}>{question.answer}</div>
        {showAnswerBox && (
          <form onSubmit={submitAnswer} className={styles.questionSubSectionAnswerForm}>
            <textarea
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setAnswer(e.target.value)}
            />
            <div className={styles.questionSubSectionAnswerFormButtons}>
              <button type="reset" onClick={() => setShowAnswerBox(false)}>
                Cancel
              </button>
              <button type="submit">Submit</button>
            </div>
          </form>
        )}
        <div
          className={styles.questionSubSectionNumHelpful}
        >{`${numHelpful} people thought this answer was helpful`}</div>
        <div className={styles.questionSubSectionNumHelpfulOptions}>
          <a onClick={markHelpful}>Mark answer as helpful</a>&nbsp;|&nbsp;
          <a onClick={() => setShowAnswerBox(true)}>Provide your own answer</a>
        </div>
      </div>
    </div>
  );
}
