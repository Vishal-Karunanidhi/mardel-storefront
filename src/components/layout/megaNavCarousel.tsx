import Slider from '@Components/slider/slider';
import MegaNavCardCarousel from '@Components/slider/cards/megaNavCarouselCard';

function MegaNavCarousel(props: any) {
  const { children: megaChild } = props;

  const sliderData = megaChild.map((e) => ({
    link: e.href ? `${window.location.origin}/${e.href}` : '/',
    imgUrl: e.thumbnail
      ? `https://${e.thumbnail}?w=75&h=75&fmt.jpeg.interlaced=true`
      : 'https://cdn.media.amplience.net',
    title: e.label
  }));

  return (
    <>
      <Slider showArrows={false} sliderTitle="MegaNavCarousel">
        {sliderData.map((item, index: number) => {
          return (
            <MegaNavCardCarousel
              key={index}
              title={item.title}
              link={item.link}
              image={item.imgUrl}
              imageAltText={item.title}
            />
          );
        })}
      </Slider>
    </>
  );
}

export default MegaNavCarousel;
