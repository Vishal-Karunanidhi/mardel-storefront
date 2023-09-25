import { MutableRefObject, useRef, useEffect, useState } from 'react';
import { TimeToLeaveOutlined } from '@mui/icons-material';
import styles from '@Styles/components/slider/cards/currentSeasonCard.module.scss';
import { imageUrlQuery } from '@Lib/common/utility';

function CurrentSeasonCard({
  title,
  link,
  image,
  imageAltText,
  windowWidth,
  screenWidth,
  setShowArrows
}) {
  const [cardWidth, setCardWidth] = useState<number>(0);
  const cardRef: MutableRefObject<any> = useRef(null);

  useEffect(() => {
    setCardWidth(cardRef.current.getBoundingClientRect().width);
  }, [windowWidth, screenWidth]);

  useEffect(() => {
    if (cardWidth) {
      if (cardWidth > 300) {
        setShowArrows(false);
      } else {
        setShowArrows(true);
      }
    }
  }, [cardWidth]);

  return (
    <>
      <a
        href={link}
        className={styles.card}
        onMouseDown={(e) => e.preventDefault()}
        onPointerDown={(e) => e.preventDefault()}
        data-testid={`current-seasons-${title.replace(/ /g, '-').toLowerCase()}`}
      >
        <div ref={cardRef}>
          <div
            style={{ height: cardWidth > 302 ? '285px' : '230px' }}
            className={styles.imageContainer}
          >
            <img src={imageUrlQuery(image, 410)} alt={imageAltText} className={styles.image} />
          </div>
          <div className={styles.title}>
            {title}
            <span className="visuallyhidden"> Category</span>
          </div>
        </div>
      </a>
    </>
  );
}

export default CurrentSeasonCard;
