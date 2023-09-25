import { useState, useEffect } from 'react';
import MarkdownView from 'react-showdown';
import Generalconst from '@Constants/generalConstants';
import { freeShippingStyle } from '@Constants/freeShippingConstants';
import ProgressBarStyles from '@Styles/cartpage/freeShippingProgressBar.module.scss';

const currencies = Generalconst.currencies;

export default function FreeShippingProgressBar(props: any): JSX.Element {
  const { freeShippingContent, cartSubTotalForFreeShippingEligibleItems } = props;
  const { shippingPromoActive, freeShippingThresholdValue } =
    freeShippingContent?.getFreeShippingPromoState;
  const balanceAmount = freeShippingThresholdValue - cartSubTotalForFreeShippingEligibleItems;
  const freeShippingAmount = parseFloat(balanceAmount.toFixed(2));
  const percentage = (cartSubTotalForFreeShippingEligibleItems / freeShippingThresholdValue) * 100;

  const [progressBarStyle, setProgressBarStyle] = useState({});

  useEffect(() => {
    const newStyle = {
      opacity: 1,
      borderBottomRightRadius: 0,
      borderTopRightRadius: 0,
      minWidth: `${percentage}%`,
      maxWidth: '100%'
    };
    setProgressBarStyle(newStyle);
  }, [cartSubTotalForFreeShippingEligibleItems]);

  const ProgressBar = ({ content }) => {
    const { achievingEligibility, notes, pendingEligibility } =
      content?.fullCartContent?.freeShippingMessages;
    const { freeShippingThresholdCurrency } = content?.getFreeShippingPromoState;
    const shippingCurrency = currencies[freeShippingThresholdCurrency];

    return (
      <>
        <div
          className={
            freeShippingAmount <= 0
              ? ProgressBarStyles.progress
              : ProgressBarStyles.progressWithoutNoteDetails
          }
        >
          <div
            className={ProgressBarStyles.progressDone}
            style={freeShippingAmount > 0 ? progressBarStyle : freeShippingStyle}
          ></div>
          {freeShippingAmount > 0 ? (
            <span
              className={ProgressBarStyles.progressContent}
            >{` ${shippingCurrency}${freeShippingAmount} ${pendingEligibility}`}</span>
          ) : (
            <span className={ProgressBarStyles.freeshippingContentText}>
              {achievingEligibility}
            </span>
          )}
        </div>
        {freeShippingAmount <= 0 && (
          <div className={ProgressBarStyles.noteDetails}>
            <span className={ProgressBarStyles.freeshippingNoteContent}>
              {notes?.richTextData ? <MarkdownView options={{tables: true, emoji: true}} markdown={notes?.richTextData} /> : ''}
            </span>
          </div>
        )}
      </>
    );
  };

  return (
    <div className={ProgressBarStyles.progressContainer}>
      {shippingPromoActive && <ProgressBar content={freeShippingContent} />}
    </div>
  );
}
