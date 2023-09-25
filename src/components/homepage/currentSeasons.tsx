import { useState, useEffect } from 'react';
import Slider from '@Components/slider/slider';
import CurrentSeasonsCard from '@Components/slider/cards/currentSeasonCard';
import seasonStyles from '@Styles/homepage/currentSeasons.module.scss';
import { imageURL } from '@Lib/common/utility';

function CurrentSeasons({ Cards, Title }: any) {
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const [screenWidth, setScreenWidth] = useState<number>(0);

  const [showArrows, setShowArrows] = useState<boolean>(false);

  useEffect(() => {
    window.addEventListener('resize', (e) => {
      setWindowWidth(window.innerWidth);
      setScreenWidth(window.screen.width);
    });
    setWindowWidth(window.innerWidth);
    setScreenWidth(window.screen.width);
  }, []);

  return (
    <div className={seasonStyles.container}>
      <h2 className={seasonStyles.header}>{Title}</h2>
      <Slider
        arrowPosition={'40%'}
        sliderStyle={{
          display: 'flex',
          alignItems: 'stretch'
        }}
        showArrows={showArrows}
        isDark={true}
        sliderTitle={Title}
      >
        {Cards.map((card, index) => {
          return (
            <CurrentSeasonsCard
              key={index}
              title={card.title}
              link={card.link}
              image={imageURL(
                card.media.image.defaultHost,
                card.media.image.endpoint,
                card.media.image.name
              )}
              imageAltText={card.media.imageAltText}
              windowWidth={windowWidth}
              screenWidth={screenWidth}
              setShowArrows={setShowArrows}
            />
          );
        })}
      </Slider>
    </div>
  );
}

export default CurrentSeasons;
