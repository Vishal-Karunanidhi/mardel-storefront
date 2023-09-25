import { GetServerSideProps } from 'next/types';
import MarkdownView from 'react-showdown';
import Breadcrumb from '@Components/breadcrumb/breadcrumb';
import HLAnchorTag from '@Components/common/hlAnchorTag';
import { getOrderReturn } from '@Lib/cms/orderDetails';
import { contentToBreadcrumb } from '@Lib/common/utility';
import { orderReturnBreadCrumbs, dialogContent } from '@Constants/orderStatus';
import OrderReturnStyles from '@Styles/orderStatus/orderLookup.module.scss';

export default function OrderReturns({ orderReturnContent }): JSX.Element {
  const { pageDescriptionLink, pageDescriptionText } = orderReturnContent;

  return (
    <>
      <Breadcrumb breadCrumbs={contentToBreadcrumb(orderReturnBreadCrumbs)} />
      <div className={OrderReturnStyles.returns}>
        <img
          src="icons/boxReturnIcon.png"
          alt="Order Return"
          width={128}
          height={128}
          aria-label="Order Return"
          className={OrderReturnStyles.boxReturnImg}
        />
        <span className={OrderReturnStyles.returnTitle}>NEED TO RETURN SOMETHING?</span>
        <span>
          {dialogContent.returnConfirmation}{' '}
          <HLAnchorTag
            value={pageDescriptionLink?.value}
            label={pageDescriptionLink?.label}
            anchorTheme="LinkType2"
          />
        </span>

        <MarkdownView options={{ tables: true, emoji: true }} markdown={pageDescriptionText} />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const deliveryKey = 'order-return';
  const orderReturnContent = await getOrderReturn(deliveryKey);

  return {
    props: {
      orderReturnContent
    }
  };
};
