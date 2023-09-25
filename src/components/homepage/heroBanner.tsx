import Link from 'next/link';
import styles from '@Styles/homepage/heroBanner.module.scss';
import { imageURL, imageUrlQuery } from '@Lib/common/utility';

export default function HeroBanner(props: any) {
  const { heading1, heading2, image, heading3, description, link, style, showCopyContents = true } = props;
  const { defaultHost, endpoint, name } = image;

  const accessibilityContent = `${heading1}% off ${heading2}. ${heading3}. ${description}`;

  return (
    <section className={styles.mainHeroBannerContainer}>
      <figure className={styles.mainHeroBanner}>
        {!link?.label && link?.value ? (
          <Link href={link.value} passHref>
            <a aria-label="Main hero banner image clickable" data-testid="hero-banner-image">
              <img
                src={imageUrlQuery(imageURL(defaultHost, endpoint, name), 1350)}
                alt="Main Hero Banner"
              />
            </a>
          </Link>
        ) : (
          <img
            src={imageUrlQuery(imageURL(defaultHost, endpoint, name), 1350)}
            alt="Main Hero Banner"
          />
        )}
        {showCopyContents && <figcaption
          aria-label={'Hero banner content ' + accessibilityContent}
          className={styles.mainHeroBannerContent}
        >
          <div className={styles.mainHeroBannerContentBlur} />
          <div className={styles.mainHeroBannerContentInfo}>
            {heading1 && (
              <span className={styles.mainHeroBannerContentInfoDiscount}>
                <span className={styles.mainHeroBannerContentInfoDiscountNumber}>{heading1}</span>
                <span className={styles.mainHeroBannerContentInfoDiscountStatic}>
                  <span className={styles.mainHeroBannerContentInfoDiscountStaticPercent}>%</span>
                  <span className={styles.mainHeroBannerContentInfoDiscountStaticOff}>off</span>
                </span>
              </span>
            )}
            <span className={styles.mainHeroBannerContentInfoCategory} style={style}>
              <span className={styles.mainHeroBannerContentInfoCategoryHeading}>{heading2}</span>
              <span className={styles.mainHeroBannerContentInfoCategorySubHeading}>{heading3}</span>
            </span>
            {link?.label && link?.value && (
              <Link href={link.value} passHref>
                <div className={styles.mainHeroBannerContentInfoOutline} aria-label={link.label}>
                  <button
                    className={styles.mainHeroBannerContentInfoOutlineLink}
                    data-testid={'main-hero-banner'}
                  >
                    {link.label}
                  </button>
                </div>
              </Link>
            )}
            {description && (
              <span className={styles.mainHeroBannerContentInfoDescription}>{description}</span>
            )}
          </div>
        </figcaption>}
      </figure>
    </section>
  );
}
