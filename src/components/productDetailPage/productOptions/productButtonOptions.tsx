import { titleCase } from '@Lib/common/utility';
import styles from '@Styles/productDetailPage/productOptions/productButtonOptions.module.scss';
import { VariantPickerKey } from '@Types/cms/schema/pdp/pdpData.schema';
import { Dispatch, SetStateAction } from 'react';

type Props = {
  optionKey: VariantPickerKey;
  variantOptions: string[];
  selectedOption: {};
  availableOptions: {};
  setSelectedOption: Dispatch<SetStateAction<{}>>;
};

export default function ProductButtonOptions({
  optionKey,
  variantOptions,
  selectedOption,
  availableOptions,
  setSelectedOption
}: Props): JSX.Element {
  function buttonClassName(option: string): string {
    const available = availableOptions[optionKey]?.includes(option);
    const selected = selectedOption[optionKey] === option;
    let className: string;
    if (!available) className = styles.disabled;
    if (available || available === undefined) className = styles.buttonSecondary;
    if (selected) className = styles.buttonPrimary;

    return className;
  }

  return (
    <div className={styles.productSizeOptions}>
      <b>Size</b>:&nbsp;{titleCase(selectedOption[optionKey])}
      <div className={styles.productSizeOptionsLayout}>
        {variantOptions?.map((option, index) => (
          <button
            key={index}
            className={buttonClassName(option)}
            onClick={() => {
              setSelectedOption((prevState) => {
                if (availableOptions[optionKey]?.includes(option)) {
                  return { ...prevState, [optionKey]: option };
                }
                return { [optionKey]: option };
              });
            }}
          >
            {titleCase(option)}
          </button>
        ))}
      </div>
    </div>
  );
}
