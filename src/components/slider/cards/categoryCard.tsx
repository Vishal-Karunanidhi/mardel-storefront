import styles from '@Styles/components/slider/cards/categoryCard.module.scss';

function CategoryCard({ title, link, image, imageAltText }) {
  return (
    <a
      href={link}
      className={styles.card}
      onMouseDown={(e) => e.preventDefault()}
      onPointerDown={(e) => e.preventDefault()}
      data-testid={`category-card-${title.replace(/ /g, '-').toLowerCase()}`}
    >
      <div>
        <div className={styles.imageContainer}>
          <img src={image} alt={imageAltText} className={styles.image} />
        </div>
        <div className={styles.text}>
          {title}
          <span className="visuallyhidden"> Category</span>
        </div>
      </div>
    </a>
  );
}

export default CategoryCard;
