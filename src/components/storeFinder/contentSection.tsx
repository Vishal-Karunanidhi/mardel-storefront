import MarkdownView from 'react-showdown';
import styles from '@Styles/storeFinder/storeSearchPage.module.scss';
import { useEffect, useRef, useState } from 'react';
import { imageURL } from '@Lib/common/utility';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';

export default function StoreFinderContent({ image, richText }) {
  const [showMore, setShowMore] = useState<boolean>(false);
  const [richTextDimensions, setRichTextDimensions] = useState<any>({ width: 1, height: 1 });
  const [imageDimensions, setImageDimensions] = useState<any>({ width: 1, height: 1 });

  const richTextRef = useRef<any>();
  const imageRef = useRef<any>();

  const setTextImageDimensions = () => {
    if (richTextRef.current) {
      setRichTextDimensions({
        width: richTextRef.current.offsetWidth,
        height: richTextRef.current.offsetHeight
      });
    }
    if (imageRef.current) {
      setImageDimensions({
        width: imageRef.current.offsetWidth,
        height: imageRef.current.offsetHeight
      });
    }
  };

  useEffect(() => {
    window.addEventListener('resize', setTextImageDimensions);
    setTextImageDimensions();
    return () => {
      window.removeEventListener('resize', setTextImageDimensions);
    };
  }, []);

  useEffect(() => {
    if (richTextRef.current) {
      setRichTextDimensions({
        width: richTextRef.current.offsetWidth,
        height: richTextRef.current.offsetHeight
      });
    }
  }, [richTextRef]);

  return (
    <div className={styles.contentSection}>
      <div className={styles.imageContainer}>
        <img
          ref={imageRef}
          alt={image.name}
          className={styles.image}
          src={imageURL(image.defaultHost, image.endpoint, image.name)}
        />
      </div>
      <div className={styles.richTextContainer}>
        <div ref={richTextRef} className={showMore ? styles.richTextOpen : styles.richTextClosed}>
          {!showMore && (
            <div
              className={
                richTextDimensions.height < imageDimensions.height ? styles.fadeOff : styles.fade
              }
            ></div>
          )}
          <MarkdownView markdown={richText} />
        </div>
        <div className={styles.seeMore}>
          {richTextDimensions.height >= imageDimensions.height && (
            <div onClick={() => setShowMore(!showMore)} className={styles.seeMoreContent}>
              {showMore ? <span>SEE LESS</span> : <span>SEE MORE</span>}
              {showMore ? (
                <ArrowDropUp fontSize="large" />
              ) : (
                <ArrowDropDown fontSize="large" style={{ position: 'relative', bottom: '1px' }} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
