import { WhatsOnSaleContentData } from 'src/types/homepage';

import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { MouseEventHandler, SyntheticEvent, useEffect, useRef } from 'react';

import styles from '@Styles/homepage/whatsOnSaleSlider.module.scss';

type ArrowProps = {
  clickHandler: MouseEventHandler;
  children: JSX.Element;
  ariaLabel: string;
};

function ArrowButton(props: ArrowProps): JSX.Element {
  const { clickHandler, children, ariaLabel } = props;

  return (
    <button
      onFocus={(e: SyntheticEvent<HTMLButtonElement>) =>
        (e.currentTarget.style.outline = `2px dashed ${styles.hlBlue}`)
      }
      onBlur={(e: SyntheticEvent<HTMLButtonElement>) => (e.currentTarget.style.outline = 'none')}
      onPointerDown={(e: SyntheticEvent<HTMLButtonElement>) => e.preventDefault()}
      onClick={clickHandler}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

export default function WhatsOnSaleSlider(props: WhatsOnSaleContentData): JSX.Element {
  const { link, heading } = props;

  const sliderLinks = useRef<HTMLUListElement>();
  const leftArrow = useRef<HTMLDivElement>();
  const rightArrow = useRef<HTMLDivElement>();
  const slider = useRef<HTMLDivElement>();

  function removeSliderArrows() {
    const sliderWidth = slider?.current?.clientWidth;
    const sliderLinksWidth = sliderLinks?.current?.scrollWidth;

    const leftArrowStyle = leftArrow?.current?.style ?? {};
    const rightArrowStyle = rightArrow?.current?.style ?? {};

    if (window.innerWidth >= 1280) {
      if (sliderLinksWidth <= sliderWidth) {
        leftArrowStyle['display'] = 'none';
        rightArrowStyle['display'] = 'none';
      } else {
        leftArrowStyle['display'] = 'flex';
        rightArrowStyle['display'] = 'flex';
      }
    } else {
      leftArrowStyle['display'] = 'none';
      rightArrowStyle['display'] = 'none';
    }
  }

  useEffect(() => {
    removeSliderArrows();
    window.onresize = removeSliderArrows;
  }, []);

  // This code was causing some rendering errors on some desktop views.
  // It is retained here temporarily by request of @JasimAtiyeh.

  // const handleRightClick = (e: SyntheticEvent): void => {
  //   const divPostion: DOMRect = e.currentTarget.parentElement.getBoundingClientRect();
  //   const children: HTMLCollection = sliderLinks.current.children;

  //   for (let index = 0; index < children.length; index++) {
  //     const childPosition = children[index].getBoundingClientRect();

  //     if (divPostion.left < Math.floor(childPosition.right)) {
  //       sliderLinks.current.scrollBy(Math.floor(childPosition.right - divPostion.left), 0);
  //       break;
  //     }
  //   }
  // };

  // const handleLeftClick = (e: SyntheticEvent): void => {
  //   const divPostion: DOMRect = e.currentTarget.parentElement.getBoundingClientRect();
  //   const children: HTMLCollection = sliderLinks.current.children;

  //   for (let index = children.length - 1; index >= 0; index--) {
  //     const childPosition = children[index].getBoundingClientRect();

  //     if (divPostion.right > Math.floor(childPosition.left)) {
  //       sliderLinks.current.scrollBy(Math.floor(childPosition.left - divPostion.right), 0);
  //       break;
  //     }
  //   }
  // };

  const handleLinkTabbing = (e: SyntheticEvent): void => {
    const linkPostion: DOMRect = e.currentTarget.getBoundingClientRect();
    const rightArrowPosition: DOMRect = rightArrow.current.getBoundingClientRect();
    const leftArrowPosition: DOMRect = leftArrow.current.getBoundingClientRect();

    if (linkPostion.right > Math.floor(rightArrowPosition.left)) {
      sliderLinks.current.scrollBy(Math.floor(linkPostion.right - rightArrowPosition.left), 0);
    } else if (linkPostion.left < Math.floor(leftArrowPosition.right)) {
      sliderLinks.current.scrollBy(Math.floor(linkPostion.left - leftArrowPosition.right), 0);
    }
  };

  const scroll = (scrollOffset: number) => {
    sliderLinks.current.scrollLeft += scrollOffset;
  };

  return (
    <section className={styles.onSale}>
      <span className={styles.onSaleTitle}>{heading}:</span>
      <section ref={slider} className={styles.onSaleSlider}>
        <div ref={leftArrow} className={styles.onSaleSliderArrow}>
          <ArrowButton clickHandler={() => scroll(-180)} ariaLabel="Left Arrow">
            <ArrowLeftIcon fontSize="large" />
          </ArrowButton>
        </div>
        <ul ref={sliderLinks} className={styles.onSaleSliderLinks}>
          {link.map((item, index: number) => {
            return (
              <li key={index} className={styles.onSaleSliderLinksItem}>
                <a
                  href={item.url}
                  onPointerDown={(e: SyntheticEvent) => e.preventDefault()}
                  onFocus={handleLinkTabbing}
                  data-testid={`whats-onsale-${item.title.replace(/ /g, '-').toLowerCase()}`}
                >
                  {item.title}
                </a>
              </li>
            );
          })}
        </ul>
        <div ref={rightArrow} className={styles.onSaleSliderArrow}>
          <ArrowButton clickHandler={() => scroll(180)} ariaLabel="Right Arrow">
            <ArrowRightIcon fontSize="large" />
          </ArrowButton>
        </div>
      </section>
    </section>
  );
}
