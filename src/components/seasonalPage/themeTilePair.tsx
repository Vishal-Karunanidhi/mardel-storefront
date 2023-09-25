import styles from '@Styles/seasonalPage/individualSeasonal.module.scss';
import { imageURL } from '@Lib/common/utility';

export default function ThemeTilePair({ viewMore1, viewMore2 }) {
  return (
    <div className={styles.themeTilePair}>
      <div className={styles.themeTile}>
        <div className={styles.themeTileImageContainer}>
          <img
            className={styles.themeTileImage}
            src={imageURL(
              viewMore1.image.defaultHost,
              viewMore1.image.endpoint,
              viewMore1.image.name
            )}
          />
        </div>
        <div className={styles.themeTileDescriptionContainer}>
          <div className={styles.themeTileDescription}>
            <h2 className={styles.themeTileHeader}>{viewMore1.header}</h2>
            <div className={styles.themeTileSubHeader}>{viewMore1.subHeader}</div>
            <a
              className={styles.themeTileButtonLink}
              target={viewMore1.link.openTab && '_blank'}
              href={viewMore1.link.url}
            >
              <button className={styles.themeTileButton}>{viewMore1.link.title}</button>
            </a>
          </div>
        </div>
      </div>
      <div className={styles.themeTile}>
        <div className={styles.themeTileImageContainer}>
          <img
            className={styles.themeTileImage}
            src={imageURL(
              viewMore2.image.defaultHost,
              viewMore2.image.endpoint,
              viewMore2.image.name
            )}
          />
        </div>
        <div className={styles.themeTileDescriptionContainer}>
          <div className={styles.themeTileDescription}>
            <h2 className={styles.themeTileHeader}>{viewMore2.header}</h2>
            <div className={styles.themeTileSubHeader}>{viewMore2.subHeader}</div>
            <a
              className={styles.themeTileButtonLink}
              target={viewMore2.link.openTab && '_blank'}
              href={viewMore2.link.url}
            >
              <button className={styles.themeTileButton}>{viewMore2.link.title}</button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
