import {
  Variant,
  VariantPicker,
  VariantPickerKey,
  VariantPickerOptions
} from '@Types/cms/schema/pdp/pdpData.schema';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import ProductColorOptions from './productColorOptions';
import ProductButtonOptions from './productButtonOptions';
import { useRouter } from 'next/router';

export default function ProductOptions(props: {
  variantPicker: VariantPicker[];
  variants: Variant[];
  variantPickerKeys: VariantPickerKey[];
  variantOptions: VariantPickerOptions;
  selectedVariantState: [Variant, Dispatch<SetStateAction<Variant>>];
}): JSX.Element {
  const { variantPicker, variants, variantPickerKeys, variantOptions, selectedVariantState } =
    props;

  const router = useRouter();
  const [selectedVariant, setSelectedVariant] = selectedVariantState;
  const [selectedOption, setSelectedOption] = useState<VariantPicker>(() => {
    return variantPickerKeys.reduce((prevValue, currKey): VariantPicker => {
      if (isVariantKey(currKey)) return prevValue;
      return { ...prevValue, [currKey]: selectedVariant.attributes[currKey].key };
    }, {} as VariantPicker);
  });
  const [availableOptions, setAvailableOptions] = useState<VariantPickerOptions>(
    {} as VariantPickerOptions
  );

  // TODO - Optomize
  useEffect(() => {
    variantPickerKeys.forEach((key: VariantPickerKey) => {
      if (isVariantKey(key)) return;
      if (isKeyNotSelected(key)) return;

      const unselectedOptionKeys: VariantPickerKey[] = removeSelectedOptionKeys(key);
      const variantsOfSelectedKey: VariantPicker[] = findPossibleVariantOptions(key);

      unselectedOptionKeys.forEach((optionKey: VariantPickerKey) => {
        if (isVariantKey(optionKey)) return;
        const optionsOfKey = findOptionsOfSelectedKey(optionKey, variantsOfSelectedKey);

        setAvailableOptions((prevState) => {
          if (wasAnUnavailableOptionSelected(prevState, key, variantsOfSelectedKey)) {
            return { [optionKey]: optionsOfKey } as VariantPickerOptions;
          }
          return { ...prevState, [optionKey]: optionsOfKey };
        });
      });
    });
  }, [selectedOption]);

  useEffect(() => {
    if (areAllOptionsSelected()) {
      const selectedVariantPicker = findSelectedVariantPicker();
      const variant = findSelectedVariant(selectedVariantPicker);
      if (variant) {
        updateSelectedVariant(variant);
      }
    }
  }, [selectedOption]);

  function isKeyNotSelected(key: VariantPickerKey): boolean {
    return !Object.keys(selectedOption).includes(key);
  }

  function isVariantKey(key: VariantPickerKey): boolean {
    return key === 'variantKey';
  }

  function removeSelectedOptionKeys(key: VariantPickerKey): VariantPickerKey[] {
    const variantOptionKeys = Object.keys(variantOptions) as (keyof VariantPickerOptions)[];
    const indexOfSelectedKey: number = variantOptionKeys.indexOf(key);
    variantOptionKeys.splice(indexOfSelectedKey, 1);

    return variantOptionKeys;
  }

  function findPossibleVariantOptions(key: VariantPickerKey): VariantPicker[] {
    return variantPicker.filter((picker) => picker[key] === selectedOption[key]);
  }

  function findOptionsOfSelectedKey(
    optionKey: VariantPickerKey,
    variantsOfSelectedKey: VariantPicker[]
  ): string[] {
    const optionsOfKey: string[] = [];
    variantsOfSelectedKey.forEach((variant: VariantPicker) =>
      optionsOfKey.push(variant[optionKey])
    );
    return optionsOfKey;
  }

  function wasAnUnavailableOptionSelected(
    prevState: VariantPickerOptions,
    key: VariantPickerKey,
    variantsOfSelectedKey: VariantPicker[]
  ): boolean {
    return !prevState[key]?.includes(variantsOfSelectedKey.at(0)[key]);
  }

  function areAllOptionsSelected(): boolean {
    return Object.keys(selectedOption).every((value: keyof VariantPicker) => {
      if (value === 'variantKey') return true;
      return variantPickerKeys.includes(value);
    });
  }

  function findSelectedVariantPicker(): VariantPicker {
    return variantPicker.find((picker: VariantPicker) => isThisPickerSelected(picker));
  }

  function isThisPickerSelected(picker: VariantPicker): boolean {
    return variantPickerKeys.every((key: VariantPickerKey) => {
      if (key === 'variantKey') return true;
      return picker[key] === selectedOption[key];
    });
  }

  function findSelectedVariant(selectedVariantPicker: VariantPicker): Variant | undefined {
    return variants.find((variant: Variant) => variant.key === selectedVariantPicker?.variantKey);
  }

  function updateSelectedVariant(variant: Variant): void {
    setSelectedVariant(variant);
    router.replace(variant.url, '', { scroll: false, shallow: true });
  }

  return (
    <>
      {variantPickerKeys &&
        variantOptions &&
        variantPickerKeys.map((key, idx) => {
          if (key === 'variantKey') return;
          if (key === 'color') {
            return (
              <ProductColorOptions
                key={idx}
                optionKey={key}
                variantAttributes={variantPicker}
                variants={variants}
                variantOptions={variantOptions[key]}
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
                availableOptions={availableOptions}
              />
            );
          }
          return (
            <ProductButtonOptions
              key={idx}
              optionKey={key}
              variantOptions={variantOptions[key]}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              availableOptions={availableOptions}
            />
          );
        })}
    </>
  );
}
