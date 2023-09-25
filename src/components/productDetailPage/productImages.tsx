import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';

import styles from '@Styles/productDetailPage/productImages.module.scss';
import { ImageItem, ImageSet, PdpPageData, Variant } from '@Types/cms/schema/pdp/pdpData.schema';
import { ProductContext } from '@Pages/product/[...product_key]';
import { imageUrlQuery } from '@Lib/common/utility';
import { MultiResolutionImageWithFallback } from '@Components/common/imageWithFallback';
import ProductFavoriteComponent from '@Components/common/productFavoriteComponent';
import { useSelector } from '@Redux/store';

type Props = {
  pdpPageData: PdpPageData;
};

export default function ProductImages({ pdpPageData }: Props): JSX.Element {
  const [selectedVariant] =
    useContext<[Variant, Dispatch<SetStateAction<Variant>>]>(ProductContext);
  const [imageItems, setImageItems] = useState<ImageItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>(() => selectedVariant.imageSet);
  const { pageType } = useSelector((state) => state.layout);

  useEffect(() => {
    if (!pageType.isGiftCardsDetailsPage) {
      fetch(selectedVariant.imageSet + '.json').then((response) => {
        response.json().then((jsonResponse) => setImageItems(jsonResponse?.items ?? []));
      });
    }
    setSelectedImage(selectedVariant.imageSet);
  }, [selectedVariant, pdpPageData.variantPickerKeys, pageType.isGiftCardsDetailsPage]);

  const sourceImageArray = [
    {
      media: '(min-width:1440px)',
      srcSet: imageUrlQuery(selectedImage, 736)
    },
    {
      media: '(min-width:1024px)',
      srcSet: imageUrlQuery(selectedImage, 519)
    },
    {
      media: '(min-width:768px) and (max-width:1023px)',
      srcSet: imageUrlQuery(selectedImage, 725)
    }
  ];
  const sourceThumbnailImageArray = (image: string): {}[] => [
    {
      media: '(min-width:1024px)',
      srcSet: imageUrlQuery(image, 100)
    },
    {
      media: '(min-width:768px)',
      srcSet: imageUrlQuery(image, 70)
    }
  ];

  return (
    <div className={styles.productImages}>
      <div className={styles.productImagesHeart} tabIndex={0}>
        <ProductFavoriteComponent
          productData={pdpPageData}
          variant={selectedVariant}
          imageUrl={selectedImage}
          imageSize={110}
          pageType="product detail page"
        />
      </div>
      <MultiResolutionImageWithFallback
        sourceArray={sourceImageArray}
        src={imageUrlQuery(selectedImage, 272, 266)}
        alt="Selected Product Image"
      />
      <div className={styles.productImagesContainer}>
        <div className={styles.productImagesContainerThumbnails}>
          {imageItems?.map((imageItem: ImageItem, index: number) => (
            <div
              style={{
                borderColor: imageItem.src == selectedImage ? styles.hlBlue : 'transparent'
              }}
              className={styles.productImagesContainerThumbnailsImage}
              key={index}
            >
              <MultiResolutionImageWithFallback
                sourceArray={sourceThumbnailImageArray(imageItem.src)}
                src={imageUrlQuery(imageItem.src, 40)}
                alt="Alternative product image"
                handleImageClick={() => setSelectedImage(imageItem.src)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
