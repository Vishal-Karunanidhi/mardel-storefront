import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { ProductContext } from '@Pages/product/[...product_key]';
import HLSelect from '@Components/common/hlSelect';
import HLTextField from '@Components/common/hlTextField';
import HLCheckbox from '@Components/common/hlCheckBox';
import { useSelector, useDispatch } from '@Redux/store';
import { getGiftCardsContent } from '@Lib/cms/plp';
import { validateEmail } from '@Lib/common/utility';
import { cartFormField } from '@Constants/cartConstants';
import { Variant } from '@Types/cms/schema/pdp/pdpData.schema';
import styles from '@Styles/productDetailPage/productDetails.module.scss';
import ProductPricingSection from '@Components/common/productPriceSection';
import RatingRatingSection from '@Components/common/productRatingSection';

let BASIC_PRICES = ['25', '50', '75', '100'];
const OTHER_PRICE = 'Other';
const GiftCardDetailsSection = () => {
  const dispatch = useDispatch();
  const { minPurchaseAmount: minPrice, maxPurchaseAmount: maxPrice } =
    useSelector((state) => state.plp)?.purchaseRange ?? {};

  useEffect(() => {
    getGiftCardsCmsData();
  }, []);

  async function getGiftCardsCmsData() {
    const giftCardData = await getGiftCardsContent();
    dispatch({
      type: 'UPDATE_GIFT_CARDS_CMS_DATA',
      payload: giftCardData
    });
  }

  BASIC_PRICES = BASIC_PRICES.filter((e) => parseInt(e) >= minPrice && parseInt(e) <= maxPrice);

  useEffect(() => {
    setCurrPriceAmount(BASIC_PRICES?.[0] ?? OTHER_PRICE);
    setCustomPriceAmount(minPrice);
  }, [minPrice, maxPrice]);

  const [currPriceAmount, setCurrPriceAmount] = useState(BASIC_PRICES?.[0]);
  const [customPriceAmount, setCustomPriceAmount] = useState(minPrice);
  const [recipientEmailError, setRecipientEmailError] = useState(false);
  const [notifyRecipient, setNotifyRecipient] = useState(false);
  const { pageType } = useSelector((state) => state.layout) ?? {};

  const PricesAllowed = BASIC_PRICES.map((e) => ({ code: e + '', name: `$${e}` }));
  PricesAllowed.push({ code: OTHER_PRICE, name: OTHER_PRICE });

  const handleGiftCardPriceChange = (e) => {
    const selctedGiftCardPrice = e?.target?.value;
    if (selctedGiftCardPrice !== PricesAllowed.at(-1) && selctedGiftCardPrice !== 'Other') {
      dispatch({
        type: 'UPDATE_SELECTED_GIFTCARD_AMOUNT',
        payload: parseInt(selctedGiftCardPrice)
      });
    } else {
      dispatch({
        type: 'UPDATE_SELECTED_GIFTCARD_AMOUNT',
        payload: parseInt(customPriceAmount)
      });
    }
    setCurrPriceAmount(selctedGiftCardPrice);
  };

  const handleCheckBoxChange = (e) => {
    const { checked } = e.target;
    setNotifyRecipient(checked);
  };

  if (pageType.isGiftCardsDetailsPage) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <label>
          {`$${minPrice}-$${maxPrice}`}
          <br />
          Processing fee $1.00 per card
        </label>

        <HLSelect
          selectBoxData={PricesAllowed}
          selectBoxValue={currPriceAmount}
          handleSelectOnChange={handleGiftCardPriceChange}
        />

        {currPriceAmount === 'Other' && (
          <HLTextField
            textFieldValue={customPriceAmount}
            textFieldType="number"
            InputProps={{
              inputProps: {
                max: maxPrice,
                min: minPrice
              }
            }}
            labelName={`Enter Amount from $${minPrice} - $${maxPrice}`}
            handleInputChange={(e) => {
              const { value } = e.currentTarget;
              const parsedValue = parseInt(value);
              if (!isNaN(parsedValue)) {
                setCustomPriceAmount(parsedValue);
              } else {
                setCustomPriceAmount('');
              }
            }}
            onBlur={(e) => {
              let { value } = e?.target;
              if (value > maxPrice) value = maxPrice;
              if (value < minPrice) value = minPrice;
              setCustomPriceAmount(value);
              dispatch({
                type: 'UPDATE_SELECTED_GIFTCARD_AMOUNT',
                payload: parseInt(value)
              });
            }}
          />
        )}

        <HLCheckbox
          checkBoxLabel={cartFormField.notifyCheckBox}
          handleCheckBoxChange={handleCheckBoxChange}
          isChecked={notifyRecipient}
        />

        {notifyRecipient && (
          <HLTextField
            labelName={cartFormField.recipientLabel}
            additionalClassName={styles.productDetailsRecipient}
            onBlur={(e) => {
              let { value } = e?.target;
              let isValidMail = validateEmail(value);
              setRecipientEmailError(!isValidMail);
              dispatch({
                type: 'UPDATE_GIFTCARD_RECIPIENT_EMAIL',
                payload: isValidMail ? value : ''
              });
            }}
            error={recipientEmailError}
            helperText={recipientEmailError ? cartFormField.invalidEmail : null}
          />
        )}
      </div>
    );
  }

  return <></>;
};

type Props = { productName: string; averageRating: number; reviewCount: number };

export default function ProductDetails({
  productName,
  averageRating,
  reviewCount
}: Props): JSX.Element {
  const { pageType } = useSelector((state) => state.layout) ?? {};
  const [selectedVariant] =
    useContext<[Variant, Dispatch<SetStateAction<Variant>>]>(ProductContext);

  return (
    <div className={styles.productDetails}>
      <div className={styles.productDetailsBrand}>{selectedVariant.attributes.brand?.label}</div>
      <h1 className={styles.productDetailsName}>{productName}</h1>
      <div className={styles.productDetailsMore}>
        <RatingRatingSection
          averageRating={averageRating}
          reviewCount={reviewCount}
          isGiftCardDetailPage={pageType.isGiftCardsDetailsPage}
        />
        <div className={styles.productDetailsMoreSkuAndShipping}>
          <div className={styles.productDetailsMoreSKU}>SKU: {selectedVariant.sku}</div>
          {selectedVariant.attributes.excludeFreeShipping && (
            <div className={styles.productDetailsMoreShipping}>Not eligible for Free Shipping</div>
          )}
        </div>
      </div>
      <GiftCardDetailsSection />
      <ProductPricingSection
        variant={selectedVariant}
        productName={productName}
        isGiftCardDetailPage={pageType.isGiftCardsDetailsPage}
      />
      {selectedVariant?.attributes?.assorted && (
        <div className={styles.productDetailsMoreSKU}>
          <span className={styles.productDetailsAssortedLabel}>Style/Color: </span>Assorted - You
          May Not Receive What Is Pictured
        </div>
      )}
    </div>
  );
}
