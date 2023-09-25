import carouselStyles from '@Styles/layout/megaNavCarousel.module.scss';

function MegaNavCardCarousel({ title, link, image, imageAltText }) {
  return (
    <div id="card" className={carouselStyles.card}>
      <a href={link}>
        <img alt={imageAltText} src={image} className={carouselStyles.image} />
        <div id="text" className={carouselStyles.text}>
          {title}
        </div>
      </a>
    </div>
  );
}

export default MegaNavCardCarousel;
