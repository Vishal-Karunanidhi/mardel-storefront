import { GetServerSidePropsResult } from 'next/types';
import { getWeeklyAd } from '@Lib/cms/weeklyAd';
import { imageUrlQuery, printBodyItems } from '@Lib/common/utility';
import { useDispatch } from '@Redux/store';
import { useEffect, useRef, useState } from 'react';
import { WeeklyAdPage } from '@Types/cms/weeklyAd';
import AddIcon from '@mui/icons-material/Add';
import HlButton from '@Components/common/button';
import ImageWithFallback, {
  MultiResolutionImageWithFallback
} from '@Components/common/imageWithFallback';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import RemoveIcon from '@mui/icons-material/Remove';
import styles from '@Styles/weeklyAd/weeklyAd.module.scss';
import WeeklyAdTile from '@Components/weeklyAd/adTile';
import { getCookie } from '@Lib/common/serverUtility';
import SeoHead from '@Components/common/seoHead';

export default function WeeklyAd({
  adTiles,
  disclaimer,
  endDate,
  generalDisclaimer,
  highlightedAd,
  messageBox,
  metaData,
  note,
  thumbnail,
  title
}: WeeklyAdPage) {
  const dispatch = useDispatch();
  const zoomSlider = useRef<HTMLDivElement>();
  const adImage = useRef<HTMLImageElement>();
  const [showFullscreenImage, setShowFullscreenImage] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(0);
  const [imageZoom, setImageZoom] = useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0
  });

  const { title: metaTitle, description, keywords } = metaData;

  useEffect(() => {
    if (zoomSlider.current) {
      zoomSlider.current.style.width = `${zoomLevel}%`;
    }
    if (adImage.current) {
      adImage.current.style.width = `${imageZoom.width}%`;
      adImage.current.style.height = `${imageZoom.height}%`;

      const imageContainer = document.getElementById('weekly-ad-image-container');
      const scrollAmount = (imageContainer.scrollWidth - imageContainer.offsetWidth) / 2;
      imageContainer.scrollLeft = scrollAmount;
    }
  }, [zoomLevel, imageZoom]);

  useEffect(() => {
    if (adTiles) {
      adTiles.sort((a, b) => a.order - b.order);
    }
  }, [adTiles]);

  const formattedDate = new Date(endDate).toLocaleDateString('en-US', { dateStyle: 'long' });

  const thumbnailImageArray = [
    {
      media: `(min-width:${styles.desktop})`,
      srcSet: imageUrlQuery(thumbnail.image.url, 411, 521)
    },
    {
      media: `(min-width:${styles.tablet})`,
      srcSet: imageUrlQuery(thumbnail.image.url, 628, 796)
    }
  ];

  function handleFullscreen(): void {
    setShowFullscreenImage(true);
    const pageType = {
      isWeeklyAdPage: true
    };
    dispatch({
      type: 'UPDATE_PAGE_TYPE',
      payload: pageType
    });
    window && window.scrollTo({ top: 0 });
  }

  function handleZoom(zoomDirection: 'positive' | 'negative'): void {
    const zoomAmount = zoomDirection === 'positive' ? 25 : -25;
    if (
      0 > zoomLevel ||
      100 < zoomLevel ||
      (zoomLevel === 0 && zoomDirection === 'negative') ||
      (zoomLevel === 100 && zoomDirection === 'positive')
    )
      return;
    setZoomLevel((currentZoom) => {
      const newZoom = currentZoom + zoomAmount;
      setImageZoom({
        width: 100 + newZoom,
        height: 100 + newZoom
      });
      return newZoom;
    });
  }

  return (
    <>
      <SeoHead
        title={metaTitle}
        description={description}
        additionalMetaTags={[
          {
            content: keywords,
            property: 'keywords'
          }
        ]}
      />
      {showFullscreenImage ? (
        <article className={styles.weeklyAdFullscreen}>
          <section className={styles.weeklyAdFullscreenSlider}>
            <RemoveIcon
              className={styles.weeklyAdFullscreenSliderIcon}
              onClick={() => handleZoom('negative')}
            />
            <div className={styles.weeklyAdFullscreenSliderLevel} ref={zoomSlider} />
            <AddIcon
              className={styles.weeklyAdFullscreenSliderIcon}
              onClick={() => handleZoom('positive')}
            />
          </section>
          <div id="weekly-ad-image-container" className={styles.weeklyAdFullscreenImageContainer}>
            <ImageWithFallback id="weekly-ad-image" ref={adImage} src={thumbnail.image.url} />
          </div>
        </article>
      ) : (
        <div className={styles.weeklyAdContainer}>
          <article className={styles.weeklyAd}>
            <section className={styles.weeklyAdTop}>
              <h2 className={styles.weeklyAdTopTitle}>{title}</h2>
              <h3 className={styles.weeklyAdTopDate}>Valid through {formattedDate}</h3>
              <p className={styles.weeklyAdTopNote}>{note}</p>
              <p className={styles.weeklyAdTopDisclaimer}>{disclaimer}</p>
            </section>
            <section className={styles.weeklyAdMiddle}>
              <section className={styles.weeklyAdMiddleThumbnail}>
                <MultiResolutionImageWithFallback
                  sourceArray={thumbnailImageArray}
                  src={imageUrlQuery(thumbnail.image.url, 295, 374)}
                />
                <div className={styles.weeklyAdMiddleThumbnailButtons}>
                  <HlButton
                    buttonTitle={'View the Weekly Ad'}
                    callbackMethod={() => handleFullscreen()}
                    parentDivClass={`${styles.weeklyAdMiddleThumbnailButtonsCTA} ${styles.eastIcon}`}
                  />
                  <HlButton
                    buttonTitle={'Print this week’s Ad'}
                    callbackMethod={() => printBodyItems()}
                    parentDivClass={`${styles.weeklyAdMiddleThumbnailButtonsCTA} ${styles.printOutline}`}
                  />
                </div>
              </section>
              <section className={styles.weeklyAdMiddleHighlightedAd}>
                <WeeklyAdTile {...highlightedAd} />
                <aside className={styles.weeklyAdMiddleHighlightedAdMessageBox}>{messageBox}</aside>
              </section>
            </section>
            <ResponsiveMasonry
              className={styles.weeklyAdTiles}
              columnsCountBreakPoints={{ 350: 1, 500: 2, 900: 3, 1440: 4 }}
            >
              <Masonry gutter="24px">
                {adTiles.map((ad, index) => (
                  <WeeklyAdTile key={index} {...ad} />
                ))}
              </Masonry>
            </ResponsiveMasonry>
            <aside className={styles.weeklyAdGeneralDisclaimer}>{generalDisclaimer}</aside>
          </article>
        </div>
      )}

      <div className={styles.printImage}>
        <ImageWithFallback id="weekly-ad-image" src={thumbnail.image.url} />
      </div>
    </>
  );
}

export async function getServerSideProps(ctx): Promise<GetServerSidePropsResult<WeeklyAdPage>> {
  const headers = getCookie(ctx);
  const weeklyAdResponse: WeeklyAdPage = await getWeeklyAd('weekly-ad', headers);

  return {
    props: weeklyAdResponse
  };
}

export function printImg(url: string): void {
  const newWindow = window.open('');
  newWindow.document.write('<img src="' + url + '" alt="Weekly Ad" />');
  newWindow.focus();
  window.print();
}
