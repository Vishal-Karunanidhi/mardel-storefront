import { useState } from 'react';
import HlButton from '@Components/common/button';
import { cancelOrderMutation } from '@Lib/cms/orderDetails';
import { dialogContent } from '@Constants/orderStatus';
import { CancelOrderResponse } from '@Types/cms/orderStatus';
import cancelOrderStyles from '@Styles/orderStatus/cancelOrder.module.scss';

export default function CancelOrderModal({
  setOpenCancelOrderModal,
  orderNumber,
  handleOrderCancel
}: any): JSX.Element {
  const [isOrderCancelled, setIsOrderCancelled] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCloseCancelOrderModal = () => {
    setOpenCancelOrderModal(false);
  };

  const handleOrderCancelAction = async () => {
    const payload = { orderNumber: orderNumber };

    const { cancelOrder: responseData }: CancelOrderResponse = await cancelOrderMutation(payload);

    if (responseData.errorMessage) {
      setErrorMessage(responseData.errorMessage);
    } else {
      setIsOrderCancelled(true);
      handleOrderCancel();
    }
  };

  return (
    <div className={cancelOrderStyles.modal} onClick={handleCloseCancelOrderModal}>
      <div className={cancelOrderStyles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={cancelOrderStyles.header}>
          <span className={cancelOrderStyles.close} onClick={handleCloseCancelOrderModal}>
            &times;
          </span>
        </div>
        <div className={cancelOrderStyles.body}>
          {isOrderCancelled ? (
            <>
              <div className={cancelOrderStyles.description}>
                The order #{orderNumber} was successfully cancelled and the payment authorization
                has been voided.
              </div>
              <div className={cancelOrderStyles.message}>
                {dialogContent.dialogErrorDescription}
              </div>
            </>
          ) : (
            <div className={cancelOrderStyles.footer}>
              {errorMessage ? (
                <div className={cancelOrderStyles.description}>{errorMessage}</div>
              ) : (
                <>
                  <div className={cancelOrderStyles.questionaire}>
                    {dialogContent.confirmationDescription}
                  </div>
                  <div className={cancelOrderStyles.message}>
                    {dialogContent.confirmationMessage}
                  </div>
                  <div className={cancelOrderStyles.confirmButton}>
                    <HlButton
                      buttonTitle={dialogContent.confirmTitle}
                      callbackMethod={handleOrderCancelAction}
                    />
                  </div>
                  <div className={cancelOrderStyles.cancelButton}>
                    <HlButton
                      buttonClass={cancelOrderStyles.submitButton}
                      buttonTitle={dialogContent.cancelTitle}
                      callbackMethod={handleCloseCancelOrderModal}
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
