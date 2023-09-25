import ImageWithFallback, {
  MultiResolutionImageWithFallback
} from '@Components/common/imageWithFallback';
import { imageUrlQuery } from '@Lib/common/utility';
import { AdTile, HighlightedAd } from '@Types/cms/weeklyAd';
import { Media } from '@Types/shared';
import MarkdownView from 'react-showdown';
import styles from '@Styles/weeklyAd/weeklyAd.module.scss';
import { useRouter } from 'next/router';

export default function WeeklyAdTile(props: HighlightedAd | AdTile): JSX.Element {
  const { blueTitle, redTitle, disclaimer, ruleContext, __typename } = props;
  const router = useRouter();
  const url = ruleContext && `weekly-ad/${ruleContext}`;
  let subtitle: string,
    image: Media,
    titleTwo: string,
    description: string,
    descriptionColumnOne: string,
    descriptionColumnTwo: string,
    disclaimerTwo: string;

  if (props.__typename === 'HighlightedAd') {
    titleTwo = props.titleTwo;
    subtitle = props.subtitle;
    descriptionColumnOne = props.descriptionColumnOne;
    descriptionColumnTwo = props.descriptionColumnTwo;
    disclaimerTwo = props.disclaimerTwo;
    image = props.adImage;
  } else {
    subtitle = props.subTitle;
    description = props.description;
    image = props.image;
  }

  const thumbnailImageArray = [
    {
      media: `(min-width:${styles.desktop})`,
      srcSet: imageUrlQuery(image.image.url, 128)
    },
    {
      media: `(min-width:${styles.tablet})`,
      srcSet: imageUrlQuery(image.image.url, 128)
    }
  ];

  return (
    <div
      className={styles.adTile}
      style={{ cursor: ruleContext ? 'pointer' : 'default' }}
      onClick={() => ruleContext && router.push(url)}
    >
      <h2 className={styles.adTileColorTitles}>
        <span className={styles.adTileColorTitlesBlue}>{blueTitle}</span>
        <span className={styles.adTileColorTitlesRed}>{redTitle}</span>
      </h2>
      {__typename === 'HighlightedAd' && titleTwo && (
        <h3 className={styles.adTileTitleTwo}>{titleTwo}</h3>
      )}
      {subtitle && <h4 className={styles.adTileSubtitle}>{subtitle}</h4>}
      <small className={styles.adTileDisclaimer}>{disclaimer}</small>
      {__typename === 'HighlightedAd' && (
        <div className={styles.adTileDescription}>
          <MarkdownView options={{ tables: true, emoji: true }} markdown={descriptionColumnOne} />
          <MarkdownView options={{ tables: true, emoji: true }} markdown={descriptionColumnTwo} />
        </div>
      )}
      {description && (
        <MarkdownView
          options={{ tables: true, emoji: true }}
          className={styles.adTileDescription}
          markdown={description}
        />
      )}
      {__typename === 'HighlightedAd' && (
        <div className={styles.adTileDisclaimerTwo}>{disclaimerTwo}</div>
      )}
      <div className={styles.adTileImage}>
        {__typename === 'HighlightedAd' ? (
          <MultiResolutionImageWithFallback
            src={imageUrlQuery(image.image.url, 270)}
            sourceArray={thumbnailImageArray}
            alt={image.imageAltText}
          />
        ) : (
          <ImageWithFallback src={imageUrlQuery(image.image.url, 270)} alt={image.imageAltText} />
        )}
      </div>
    </div>
  );
}
