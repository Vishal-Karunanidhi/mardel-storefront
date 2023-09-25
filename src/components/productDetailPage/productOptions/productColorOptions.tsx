import Slider from '@Components/slider/slider';
import { List, GridView } from '@mui/icons-material';
import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { Variant, VariantPicker } from '@Types/cms/schema/pdp/pdpData.schema';
import styles from '@Styles/productDetailPage/productOptions/productColorOptions.module.scss';
import ImageWithFallback from '@Components/common/imageWithFallback';
import { imageUrlQuery, titleCase } from '@Lib/common/utility';

type Props = {
  optionKey: string;
  variantAttributes: VariantPicker[];
  variants: Variant[];
  variantOptions: string[];
  selectedOption: {};
  availableOptions: {};
  setSelectedOption: Dispatch<SetStateAction<{}>>;
};

export default function ProductColorOptions({
  optionKey,
  variantAttributes,
  variants,
  variantOptions,
  selectedOption,
  availableOptions,
  setSelectedOption
}: Props): JSX.Element {
  const [selectedView, setSelectedView] = useState<'grid' | 'list'>('grid');
  const [isDesktop, setIsDesktop] = useState<boolean>();

  const checkForDesktopView = () => {
    setIsDesktop(window.innerWidth >= Number.parseInt(styles.hlLgBreakpoint));
  };

  useEffect(() => {
    checkForDesktopView();
    window.addEventListener('resize', checkForDesktopView);
  }, []);

  const handleClick = (option: string) => {
    setSelectedOption((prevState) => {
      if (availableOptions[optionKey]?.includes(option)) {
        return { ...prevState, [optionKey]: option };
      }
      return { [optionKey]: option };
    });
  };

  const colorOptionsTabs = (
    <div className={styles.productColorOptionsTitle}>
      <div className={styles.productColorOptionsTitleColor}>
        <b>Color:</b>
        &nbsp;
        {titleCase(selectedOption[optionKey])}
      </div>
      <div className={styles.productColorOptionsTitleViews}>
        <div
          className={
            styles.productColorOptionsTitleViewsIcon +
            ` ${selectedView === 'grid' && styles.selectedTab}`
          }
          onClick={() => setSelectedView('grid')}
          tabIndex={0}
        >
          {<GridView className={selectedView === 'grid' ? styles.selectedIcon : ''} />} Grid
        </div>
        <div
          className={
            styles.productColorOptionsTitleViewsIcon +
            ` ${selectedView === 'list' && styles.selectedTab}`
          }
          onClick={() => setSelectedView('list')}
          tabIndex={0}
        >
          {<List className={selectedView === 'list' ? styles.selectedIcon : ''} />} List
        </div>
      </div>
    </div>
  );

  const sliderImage = (color: string): JSX.Element => {
    if (variantOptions.includes(color)) {
      const variantKey = variantAttributes.find(
        (attribute) => attribute.color === color
      ).variantKey;
      const variant = variants.find((variant) => variant.key === variantKey);
      const availiable = availableOptions[optionKey]?.includes(color) ?? true;
      const imageUrl = imageUrlQuery(variant?.imageSet, 40) + '?' + variant?.swatchUrl;
      const selected = selectedOption[optionKey] === color;

      return (
        <div className={styles.productColorOptionsImagesImageDisabled}>
          <div
            className={
              styles.productColorOptionsImagesImage + ` ${selected && styles.selectedImage}`
            }
            tabIndex={0}
          >
            <ImageWithFallback
              handleImageClick={() => handleClick(color)}
              src={imageUrl}
              alt="Selected product variant"
            />
          </div>
          {!availiable && <hr />}
        </div>
      );
    }
  };

  const colorImageGrid = (): JSX.Element[] => {
    const gridSize = isDesktop ? 4 : 2;
    const imageColumnCards = [];

    for (let index = 0; index < variantOptions?.length; index += gridSize) {
      imageColumnCards.push(
        <div className={styles.productColorOptionsImagesGrid} key={index}>
          {sliderImage(variantOptions[index])}
          {sliderImage(variantOptions[index + 1])}
          {isDesktop && sliderImage(variantOptions[index + 2])}
          {isDesktop && sliderImage(variantOptions[index + 3])}
        </div>
      );
    }

    return imageColumnCards;
  };

  const colorImageList = (): JSX.Element[] => {
    const imageColumnCards = [];

    for (let index = 0; index < variantOptions?.length; index++) {
      const color = variantOptions[index];
      const selected = selectedOption[optionKey] === color;

      imageColumnCards.push(
        <div
          className={
            styles.productColorOptionsImagesList + ` ${selected && styles.selectedImageText}`
          }
          key={index}
          onClick={() => handleClick(color)}
        >
          {sliderImage(color)}
          {titleCase(color)}
        </div>
      );
    }

    return imageColumnCards;
  };

  return (
    <div className={styles.productColorOptions}>
      {colorOptionsTabs}
      <hr />
      {selectedView === 'grid' ? (
        <Slider arrowSize="small" sliderTitle="pdpMultivariantPicker">
          {colorImageGrid()}
        </Slider>
      ) : (
        <div className={styles.productColorOptionsTitleViewsList}>{colorImageList()}</div>
      )}
    </div>
  );
}
