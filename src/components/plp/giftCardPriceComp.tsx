import { useSelector } from '@Redux/store';
import CatStyles from '@Styles/plp/categoryListingPages.module.scss';

export default function GiftCardPriceComp(props: any): JSX.Element {
  const { isGiftCardSku, gcPurchaseRange, isGcPriceFromAutoComplete = false } = props;

  const { pageType } = useSelector((state) => state.layout) ?? {};

  const { minPurchaseAmount = '', maxPurchaseAmount = '' } = isGcPriceFromAutoComplete
    ? gcPurchaseRange
    : useSelector((state) => state.plp)?.purchaseRange || {};

  if (pageType?.isGiftCardsCategory || isGiftCardSku) {
    return (
      <span className={CatStyles.giftcardPrice}>
        ${minPurchaseAmount} - ${maxPurchaseAmount}
      </span>
    );
  }

  return <></>;
}
