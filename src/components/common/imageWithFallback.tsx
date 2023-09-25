import React, { forwardRef, useState } from 'react';
import styles from '@Styles/components/common/imageFallback.module.scss';

const defaultFallback = process.env.NEXT_PUBLIC_FALLBACK_IMAGE ?? '/fallback_checker.png';
const ImageWithFallback = forwardRef<HTMLImageElement, any>((props: any, imageRef): JSX.Element => {
  const { src, handleImageClick, alt, ...rest } = props;
  const [isImageErrored, setIsImageErrored] = useState(false);

  let imageToLoad = src;
  if (isImageErrored || !src || src === 'undefined' || src === 'null') {
    imageToLoad = defaultFallback;
  }
  const queryParamArray = src?.split('?') ?? null;
  const params = queryParamArray?.length > 1 ? queryParamArray[1] : '';

  return (
    <>
      <img
        onClick={handleImageClick}
        src={imageToLoad}
        alt={alt}
        ref={imageRef}
        {...rest}
        onError={({ currentTarget }) => {
          const fallbackURLContruct = `${defaultFallback}?${params}`;
          currentTarget.onerror = null;

          if (currentTarget.src !== fallbackURLContruct) {
            setIsImageErrored(true);
            currentTarget.src = fallbackURLContruct;
          } else {
            currentTarget.src = '/fallback_checker.png';
          }
        }}
      />
    </>
  );
});

ImageWithFallback.displayName = 'ImageWithFallback';

const MultiResolutionImageWithFallback = (props: any): JSX.Element => {
  const { src, handleImageClick, sourceArray, alt, fallbackDimension, fallbackClassname, ...rest } =
    props;
  const [isImageErrored, setIsImageErrored] = useState(false);
  let className = '';

  let imageToLoad = src;
  if (isImageErrored || !src || src === 'undefined' || src === 'null') {
    imageToLoad = defaultFallback;
  }

  const regexToValidateUrl = new RegExp('^(?:[a-z+]+:)?//', 'i');
  if (!regexToValidateUrl.test(src)) {
    imageToLoad = defaultFallback;
    className = fallbackClassname ?? styles.fallbackResolutionDimension;
  }

  sourceArray.forEach((e) => (e.srcSet = regexToValidateUrl.test(e?.srcSet) ? e?.srcSet : ''));

  return (
    <picture>
      {sourceArray.map((e, i: number) => (
        <source media={e.media} srcSet={e.srcSet} key={`MediaArrayImg${i}`} />
      ))}
      <img
        alt={alt}
        onClick={handleImageClick}
        src={imageToLoad}
        {...rest}
        className={className}
        onError={({ currentTarget }) => {
          const fallbackURLContruct = defaultFallback;
          currentTarget.onerror = null;
          if (currentTarget.src !== fallbackURLContruct) {
            setIsImageErrored(true);
            currentTarget.src = fallbackURLContruct;
          } else {
            currentTarget.src = '/fallback_checker.png';
          }
        }}
      />
    </picture>
  );
};

export default React.memo(ImageWithFallback);
export { MultiResolutionImageWithFallback };

/* Sample Reference for Image Stream
  // const [imgSrc, setImgSrc] = useState(src);
   useEffect(() => {
    fetch(src).then(async (res) => {
      let finalImageUrl = fallbackSrc ?? '/fallback_checker.png';
      if (res.status !== 404) {
        const output = await res.blob();
        finalImageUrl = URL.createObjectURL(output);
      }
      setImgSrc(finalImageUrl);
      console.log('imgSrcimgSrcimgSrc');
    });
  }, []); */
