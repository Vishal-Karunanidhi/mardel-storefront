import { GetServerSidePropsResult } from 'next/types';
import Breadcrumb from '@Components/breadcrumb/breadcrumb';
import VideoComponent from '@Components/homepage/videoComponent';
import ImageWithFallback from '@Components/common/imageWithFallback';
import { HlAnchorWrapper } from '@Components/common/button';
import ProjectCarousel from '@Components/homepage/projectCarousel';
import { contentToBreadcrumb } from '@Lib/common/utility';
import { getLandingPage } from '@Lib/cms/diyInspiration';
import { defaultHomeBCrumbs } from '@Constants/generalConstants';
import DiyLpStyles from '@Styles/diyInspiration/landingPage.module.scss';

const diyBreadCrumbs = {
  links: [
    defaultHomeBCrumbs,
    {
      key: 'DIY Inspiration',
      label: 'DIY Inspiration',
      value: 'null',
      openInNewTab: false
    }
  ]
};

const BannerComp = (props) => {
  const {
    bannerImage: { image, imageAltText },
    title,
    description
  } = props;
  return (
    <>
      <ImageWithFallback src={image?.url} alt={imageAltText} className={DiyLpStyles.banner} />
      <span className={DiyLpStyles.bannerContents}>
        <h2 className={DiyLpStyles.title}>{title}</h2>
        <span className={DiyLpStyles.description}>{description}</span>
      </span>
    </>
  );
};

const CategoriesComp = ({ categories, categoryClassType }) => {
  return (
    <span className={DiyLpStyles.categoriesSpan}>
      {categories.map(({ image: { image, imageAltText }, title, deliveryKey}, index) => (
        <span key={index} className={`${DiyLpStyles.multiCol} ${DiyLpStyles[categoryClassType]}`}>
          <HlAnchorWrapper href={deliveryKey}>
            <ImageWithFallback
              src={image?.url}
              className={DiyLpStyles.categoryImage}
              alt={imageAltText}
            />
          </HlAnchorWrapper>

          <HlAnchorWrapper href={deliveryKey}>
            <span>{title}</span>
          </HlAnchorWrapper>
        </span>
      ))}
    </span>
  );
};

export default function DiyInspiration({ landingPageDetails }): JSX.Element {
  const { banner, twoColumnCategories, threeColumnCategories, videoComponent, youMayAlsoLike } =
    landingPageDetails;

  return (
    <>
      <Breadcrumb breadCrumbs={contentToBreadcrumb(diyBreadCrumbs)} />
      <div className={DiyLpStyles.wrapper}>
        <BannerComp {...banner} />
        <CategoriesComp categories={twoColumnCategories} categoryClassType={'twoCol'} />
        <CategoriesComp categories={threeColumnCategories} categoryClassType={'threeCol'} />
        <VideoComponent {...videoComponent} />
      </div>
      <div className={DiyLpStyles.yMALWrapper}>
        {youMayAlsoLike && (
          <ProjectCarousel
            label="You May Also Like"
            productDetails={youMayAlsoLike}
            showViewAll={false}
          />
        )}
      </div>
    </>
  );
}

export async function getServerSideProps(ctx): Promise<GetServerSidePropsResult<any>> {
  const landingPageDetails = await getLandingPage();

  return {
    props: {
      landingPageDetails
    }
  };
}
