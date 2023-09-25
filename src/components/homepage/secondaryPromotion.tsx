import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Link from 'next/link';
import { CardActionArea } from '@mui/material';
import styles from '@Styles/homepage/secondaryPromotion.module.scss';
import ctaCardStyles from '@Styles/lookBookPage/lookbook.module.scss';
import { Promos } from 'src/types/homepage';
import { ContentCTA } from '@Types/cms/schema/contentPage.schema';
import { HlPageLinkButton } from '@Components/common/button';
import { MouseEventHandler, useEffect, useState } from 'react';
import ShopImageDrawer from '@Components/common/shopImageDrawer';
import { imageUrlQuery, useVisibility } from '@Lib/common/utility';
import { Ga4PromotionEcommerce } from 'src/interfaces/ga4Ecommerce';
import { useSelector } from '@Redux/store';

type PromoComponentProps = (Promos | ContentCTA) & {
  style?: React.CSSProperties;
  imgStyle?: React.CSSProperties;
  shopImageProducts?: any;
};

const PromoComponent = (promoProps: PromoComponentProps): JSX.Element => {
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  if (promoProps.__typename === 'ContentCTA') {
    return (
      <div className={ctaCardStyles.ctaCard}>
        <div className={ctaCardStyles.ctaCardText}>{promoProps.body}</div>
        <HlPageLinkButton
          href={promoProps.cta.value}
          buttonTitle={promoProps.cta.label}
          anchorProps={{ style: { width: '232px' } }}
        />
      </div>
    );
  }

  const { discountLabel, description, link, style, imgStyle } = promoProps;
  const { image, imageAltText } = promoProps?.media;
  const { showCartBagIcon = true, showShareIcon = false, shopImageProducts } = promoProps;
  const { defaultHost, endpoint, name } = image;
  const imageSrc = `https://${defaultHost}/i/${endpoint}/${name}`;

  const [isVisible, currentElement] = useVisibility<HTMLDivElement>(100);
  const { heartBeatInfo } = useSelector((state) => state.auth) ?? {};

  useEffect(() => {
    if (isVisible) handlePromotionEvent('view_promotion');
  }, [isVisible]);

  function handlePromotionEvent(event: 'view_promotion' | 'select_promotion') {
    if (window) {
      const gtmData: Ga4PromotionEcommerce = {
        event: event,
        creative_name: '',
        creative_slot: '',
        location_id: '',
        promotion_name: `${discountLabel} ${description}`,
        promotion_id: '',
        anonymous_user_id: '',
        ecommerce: {
          items: []
        },
        user_id: ''
      };

      if (heartBeatInfo?.sessionId) {
        heartBeatInfo?.isLoggedInUser
          ? (gtmData.user_id = heartBeatInfo?.sessionId)
          : (gtmData.anonymous_user_id = heartBeatInfo?.sessionId);
      }

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ ecommerce: null }); // Clear the previous ecommerce object.
      window.dataLayer.push(gtmData);
    }
  }

  const linkItem = (linkChild) => (
    <Link href={link || ''}>
      <a data-testid={'secondary-promo-link'}>{linkChild}</a>
    </Link>
  );

  const iconButton = (
    imgSrc: string,
    onClickHandler: MouseEventHandler<HTMLButtonElement>
  ): JSX.Element => (
    <button
      className={styles.cartButton}
      onClick={onClickHandler}
      data-testid={'secondary-promo-cart-button'}
    >
      <img src={imgSrc} alt="Share Icon" width="48" height="48" />
    </button>
  );

  return (
    <>
      {showDrawer && (
        <ShopImageDrawer
          open={showDrawer}
          onClose={() => setShowDrawer(false)}
          products={shopImageProducts}
        />
      )}
      <Card
        ref={currentElement}
        onClick={() => handlePromotionEvent('select_promotion')}
        className={styles.promoCard}
        key={description}
        style={style}
      >
        <>
          <CardActionArea
            disableRipple
            onClick={() => window.open(link, '_self')}
            className={styles.cardActionArea}
            data-testid={'secondary-promo-card-action-area'}
          >
            <CardMedia
              component="img"
              image={imageUrlQuery(imageSrc, 750)}
              alt={imageAltText}
              className={styles.promoImage}
              style={imgStyle}
            />
          </CardActionArea>
        </>

        <div className={styles.cardActions}>
          <div className={styles.cardActionsButtons}>
            {showCartBagIcon &&
              shopImageProducts &&
              iconButton('/cartBag.svg', () => setShowDrawer(true))}
            {showShareIcon && iconButton('/share.svg', () => {})}
          </div>

          <div className={styles.labelContainer}>
            <label className={styles.discountDescription}>
              {discountLabel && <label className={styles.highlight}>{discountLabel}</label>}{' '}
              {description && linkItem(description)}
            </label>
          </div>

          <Button
            size="small"
            style={{ float: 'right', marginTop: 0, marginRight: 2 }}
            className={styles.rightArrow}
            disableRipple
            onClick={() => window.open(link, '_self')}
            data-testid={'secondary-promo-arrow'}
          >
            <img
              src={'/icons/rightArrow.svg'}
              alt="Right arrow"
              width="37"
              height="15"
              className={styles.rightArrowImage}
            />
          </Button>
        </div>
      </Card>
    </>
  );
};

type SecondaryPromoComponentProps = {
  Promos: (Promos | ContentCTA)[];
  style?: React.CSSProperties;
  gridStyle?: React.CSSProperties;
  imgStyle?: React.CSSProperties;
};

export default function SecondaryPromotion(props: SecondaryPromoComponentProps): JSX.Element {
  const { Promos, style, gridStyle, imgStyle } = props;
  return (
    <span className={styles.promoGrid} style={gridStyle}>
      {Promos &&
        Promos.map((promo, idx) => (
          <PromoComponent key={idx} {...promo} style={style} imgStyle={imgStyle} />
        ))}
    </span>
  );
}
