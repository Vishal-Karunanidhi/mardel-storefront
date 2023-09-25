import { imageUrlQuery } from '@Lib/common/utility';
import styles from '@Styles/components/slider/cards/shopByCategoryCard.module.scss';

function ShopByCategoryCard({ title, link, image, imageAltText }) {
  return (
    <a
      href={`/${link}`}
      className={styles.card}
      onMouseDown={(e) => e.preventDefault()}
      onPointerDown={(e) => e.preventDefault()}
      data-testid={`shop-by-cat-${title.replace(/ /g, '-').toLowerCase()}`}
    >
      <div>
        <div className={styles.imageContainer}>
          <img src={imageUrlQuery(image, 300)} alt={imageAltText} className={styles.image} />
        </div>
        <div className={styles.text}>
          {title}
          <span className="visuallyhidden"> Category</span>
        </div>
      </div>
    </a>
  );
}

export default ShopByCategoryCard;
