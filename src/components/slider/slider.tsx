import { useState, useRef, useEffect, MutableRefObject } from 'react';
import { CarouselIcon } from '@Icons/carousel/carouselArrow';
import CarouselIconSmall from '@Icons/carousel/carouselArrowSmall';
import smoothscroll from 'smoothscroll-polyfill';
import styles from '@Styles/components/slider/slider.module.scss';
import { Ga4CarouselClickDataLayer } from 'src/interfaces/ga4DataLayer';
import { useSelector } from '@Redux/store';

function Slider({
  arrowPosition = undefined,
  arrowSize = 'large',
  showArrows = true,
  children,
  sliderStyle = undefined,
  wrapperStyle = undefined,
  containerStyle = undefined,
  isDark = false,
  sliderTitle = ''
}) {
  const { heartBeatInfo } = useSelector((state) => state.auth) ?? {};

  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [screenWidth, setScreenWidth] = useState<number>(0);

  const [scrollDistance, setScrollDistance] = useState<number>(0);
  const [scrollWidth, setScrollWidth] = useState<number>(0);

  const [sliderWidth, setSliderWidth] = useState<number>(0);
  const [sliderRect, setSliderRect] = useState<any>();

  const [isHovered, setIsHovered] = useState<boolean>(false);

  const sliderRef: MutableRefObject<any> = useRef(null);
  const containerRef: MutableRefObject<any> = useRef(null);

  const mobile: number = 1024;
  const isMobile: boolean = windowWidth < mobile || screenWidth < mobile;

  const scrollForward = () => {
    handleCarouselClick();
    sliderRef.current.scrollTo({
      left: scrollDistance + sliderRect.width,
      behavior: 'smooth'
    });
  };

  const scrollBackward = () => {
    handleCarouselClick();
    sliderRef.current.scrollTo({
      left: scrollDistance - sliderRect.width,
      behavior: 'smooth'
    });
  };

  function handleCarouselClick() {
    if (window && heartBeatInfo) {
      const { isLoggedInUser, sessionId } = heartBeatInfo;
      const gtmData: Ga4CarouselClickDataLayer = {
        anonymous_user_id: '',
        carousel_card: sliderTitle,
        carousel_cat: sliderTitle,
        event: 'carousel_click',
        user_id: ''
      };

      if (sessionId) {
        isLoggedInUser ? (gtmData.user_id = sessionId) : (gtmData.anonymous_user_id = sessionId);
      }
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(gtmData);
    }
  }

  const ArrowIcon = (props) => {
    if (arrowSize === 'small') {
      return <CarouselIconSmall {...props} />;
    } else {
      return <CarouselIcon {...props} />;
    }
  };

  useEffect(() => {
    window.addEventListener('resize', (e) => {
      setWindowWidth(window.innerWidth);
      setScreenWidth(window.screen.width);
    });
    setWindowWidth(window.innerWidth);
    setScreenWidth(window.screen.width);
  }, []);

  useEffect(() => {
    if (sliderRef) {
      setSliderRect(sliderRef.current.getBoundingClientRect());
    }
  }, [windowWidth, screenWidth, sliderRef]);

  useEffect(() => {
    if (sliderRef.current) {
      setScrollWidth(sliderRef.current.scrollWidth);
    }
  }, [sliderRef, windowWidth]);

  useEffect(() => {
    if (sliderRect) {
      setSliderWidth(sliderRect.width);
    }
  }, [scrollWidth]);

  useEffect(() => {
    if (window) {
      smoothscroll.polyfill();
    }
  }, []);

  return (
    <>
      <div ref={containerRef} className={styles.sliderContainer} style={containerStyle}>
        <div
          onMouseOver={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={styles.sliderWrapper}
          style={wrapperStyle}
        >
          {
            showArrows && !isMobile && (
              <ArrowIcon
                onClick={scrollBackward}
                iconDivClass={arrowSize === 'small' ? styles.leftArrowSmall : styles.leftArrow}
                rotation={180}
                opacity={scrollDistance - 1 <= 0 ? '0' : '100'}
                visibility={scrollDistance <= 0 ? 'hidden' : 'visible'}
                arrowPosition={arrowPosition}
                ariaLabel="slider left arrow"
              />
            )
            // : (
            //   <ArrowIcon
            //     onClick={scrollBackward}
            //     iconDivClass={arrowSize === 'small' ? styles.leftArrowSmall : styles.leftArrow}
            //     rotation={180}
            //     opacity={scrollDistance > 0 && isHovered && screenWidth > mobile ? '100' : '0'}
            //     visibility={screenWidth >= mobile ? 'visible' : 'hidden'}
            //     arrowPosition={arrowPosition}
            //   />
            // ))
          }

          <div
            onScroll={(e: any) => {
              setScrollDistance(e.target.scrollLeft);
            }}
            ref={sliderRef}
            className={`${
              sliderWidth && scrollWidth
                ? sliderRect.width + 1 >= scrollWidth
                  ? styles.sliderHideScrollbar
                  : isDark
                  ? styles.sliderDarkTrack
                  : styles.slider
                : styles.sliderHideScrollbar
            } persistingSliderClass`}
            style={sliderStyle}
          >
            {children}
          </div>
          {
            showArrows && !isMobile && (
              <ArrowIcon
                onClick={scrollForward}
                iconDivClass={arrowSize === 'small' ? styles.rightArrowSmall : styles.rightArrow}
                rotation={0}
                opacity={
                  sliderWidth &&
                  scrollWidth &&
                  Math.ceil(sliderRect.width) + 1 + scrollDistance < scrollWidth
                    ? '100'
                    : '0'
                }
                visibility={
                  sliderWidth &&
                  scrollWidth &&
                  Math.ceil(sliderRect.width) + 1 + scrollDistance < scrollWidth
                    ? 'visible'
                    : 'hidden'
                }
                arrowPosition={arrowPosition}
                ariaLabel="slider right arrow"
              />
            )
            // : (
            //   <ArrowIcon
            //     onClick={scrollForward}
            //     iconDivClass={arrowSize === 'small' ? styles.rightArrowSmall : styles.rightArrow}
            //     rotation={0}
            //     opacity={
            //       sliderWidth &&
            //       Math.round(sliderRect.width) + scrollDistance < scrollWidth &&
            //       isHovered &&
            //       screenWidth > mobile
            //         ? '100'
            //         : '0'
            //     }
            //     visibility={screenWidth >= mobile ? 'visible' : 'hidden'}
            //     arrowPosition={arrowPosition}
            //   />
            // ))
          }
        </div>
      </div>
    </>
  );
}

export default Slider;
