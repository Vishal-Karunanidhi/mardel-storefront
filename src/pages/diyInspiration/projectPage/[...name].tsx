import { useRouter } from 'next/router';
import { GetServerSidePropsResult } from 'next/types';
import Breadcrumb from '@Components/breadcrumb/breadcrumb';
import ShareButton from '@Components/common/shareButton';
import VideoComponent from '@Components/homepage/videoComponent';
import ImageWithFallback from '@Components/common/imageWithFallback';
import HlButton, { HlPageLinkButton } from '@Components/common/button';
import FeaturedItems from '@Components/homepage/featuredItems';
import ProjectCarousel from '@Components/homepage/projectCarousel';
import CategorySlider from '@Components/landingPage/department/components/categorySlider';
import { getProjectPage } from '@Lib/cms/diyInspiration';
import { contentToBreadcrumb } from '@Lib/common/utility';
import { defaultHomeBCrumbs } from '@Constants/generalConstants';
import DiyLpStyles from '@Styles/diyInspiration/landingPage.module.scss';
import DiyPpStyles from '@Styles/diyInspiration/projectPage.module.scss';
import { printBodyItems } from '@Lib/common/utility';
import { redirectTo404Page } from '@Lib/common/serverUtility';

const BannerComp = (props) => {
  const { query } = useRouter();
  const {
    banner: { image, imageAltText, inspirationPdfTutorial, video },
    name,
    description,
    title
  } = props;
  const imageUrl = video?.videolink;

  return (
    <span className={DiyPpStyles.bannerWrapper}>
      {video?.videolink && image && (
        <span className={DiyPpStyles.projectVideo}>
          <VideoComponent video={{ ...video, image, imageAltText }} description={description} />
        </span>
      )}
      <span className={DiyLpStyles.bannerContents}>
        <span className={`${DiyLpStyles.title} ${DiyPpStyles.title}`}>{title}</span>
        <span className={DiyLpStyles.description}>{description}</span>
        <span className={DiyPpStyles.pdfShare}>
          <ShareButton
            shareType="Product"
            header={title}
            subHeader={query?.name?.at(-1)}
            productSku={query?.name?.at(-1)}
          />
          {inspirationPdfTutorial?.url && (
            <HlPageLinkButton
              buttonTitle={'Download Inspiration'}
              href={inspirationPdfTutorial?.url}
              openInNewTab={inspirationPdfTutorial?.openInNewTab}
            />
          )}
        </span>
      </span>
    </span>
  );
};

const SkillDurationcomp = (props) => {
  const { skillLevel, duration } = props;

  return (
    <span className={DiyPpStyles.skillSpan}>
      <span className={DiyPpStyles.skillLevelTitle}>
        SKILL LEVEL: <b>{skillLevel}</b>
      </span>
      <span className={DiyPpStyles.duration}>
        <img src={'/icons/clock.svg'} alt={'Duration'} width={14} height={12} aria-label="delete" />{' '}
        {duration} MINUTES
      </span>
    </span>
  );
};

const printInstructions = () => {
  const printId = document.getElementById('printInstructions').innerHTML;
  const itemsToPrint = '<html><head><title></title></head><body>' + printId + '</body></html>';
  const oldPage = document.body.innerHTML;
  document.body.innerHTML = itemsToPrint;
  window.print();
  setTimeout(() => {
    document.body.innerHTML = oldPage;
  }, 2000);
};

const YouWillNeedComp = ({ title, description, image: { image }, classStyles }) => {
  return (
    <span className={DiyPpStyles.instructionSet}>
      <ImageWithFallback
        src={image?.url}
        alt={image?.imageAltText}
        className={`${DiyLpStyles.banner} ${classStyles.image}`}
        layout="responsive"
      />
      <div className={`${DiyPpStyles.bannerContents}`}>
        <span className={`${DiyLpStyles.title} ${classStyles.title}`}>{title}</span>
        <span className={`${DiyLpStyles.description} ${classStyles.description}`}>
          {description}
        </span>
      </div>
    </span>
  );
};

export default function DiyProjectPage({ projectPage, projectBcrumbs }): JSX.Element {
  const exploreCategories = projectPage?.exploreCategories?.map((content) => ({
    content
  }));

  return (
    <>
      <Breadcrumb breadCrumbs={contentToBreadcrumb(projectBcrumbs)} />
      <div className={DiyPpStyles.desktopContainer}>
        <BannerComp {...projectPage} />
        {/* <span className={DiyPpStyles.skillSpan}></span> */}
        {projectPage.skillLevel && projectPage.duration && <SkillDurationcomp {...projectPage} />}
        {projectPage?.preRequisites?.description && projectPage?.preRequisites?.title && (
          <div className={DiyPpStyles.youWillNeedContainer}>
            <YouWillNeedComp
              {...projectPage?.preRequisites}
              classStyles={{
                image: DiyPpStyles.youWillNeedImage,
                title: DiyPpStyles.preReqTitle,
                description: DiyPpStyles.preReqDescription
              }}
            />
          </div>
        )}

        {projectPage?.stepByStepInstruction?.length && (
          <>
            <span className={DiyPpStyles.instructionSetHeader}>
              <span>Instructions</span>
              <div className={DiyPpStyles.cancelButton}>
                {/* I'm keeping this code here in case we want to add the print button back at a later date. */}
                {/* <HlButton
                buttonTitle={
                  <>
                    Print It{' '}
                    <img
                      src={'/icons/print.svg'}
                      alt={'Duration'}
                      width={14}
                      height={12}
                      aria-label="delete"
                    />
                  </>
                }
                onClick={() => {
                  printBodyItems();
                  setTimeout(() => {
                    console.log('printing');
                  }, 3000);
                }}
              /> */}
              </div>
            </span>

            <div className={DiyPpStyles.stepByStepInstruction} id="printInstructions">
              {projectPage?.stepByStepInstruction?.map((e, key) => (
                <YouWillNeedComp
                  key={key}
                  {...e}
                  classStyles={{
                    image: DiyPpStyles.preReqImage,
                    title: DiyPpStyles.preReqTitle,
                    description: DiyPpStyles.preReqDescription
                  }}
                />
              ))}
            </div>
          </>
        )}

        <div className={DiyPpStyles.shopTheItemCarousel}>
          {projectPage?.shopTheItems && (
            <FeaturedItems label="Shop the Items" products={projectPage?.shopTheItems} />
          )}
        </div>

        <br />

        <div className={DiyPpStyles.relatedCategories}>
          {exploreCategories && (
            <CategorySlider
              cards={exploreCategories}
              labels={{ categoryCarousel: 'Explore the categories' }}
            />
          )}
        </div>
      </div>

      {projectPage?.youMayAlsoLike && (
        <div className={DiyPpStyles.projectCarouselContainer}>
          <ProjectCarousel
            label="You May Also Like"
            productDetails={projectPage?.youMayAlsoLike}
            showViewAll={false}
          />
        </div>
      )}
    </>
  );
}

export async function getServerSideProps({ query }): Promise<GetServerSidePropsResult<any>> {
  const deliveryKey = query?.name?.at(-1);
  const projectPageDetails = await getProjectPage(deliveryKey);

  if (!projectPageDetails) {
    return redirectTo404Page();
  }

  const { parentCategoryInfo, projectPage } = projectPageDetails;

  const diyBreadCrumbs = {
    links: [
      defaultHomeBCrumbs,
      {
        key: 'DIY Inspiration',
        label: 'DIY Inspiration',
        value: '/DIY-Projects-Videos/c/13',
        openInNewTab: false
      },
      {
        key: parentCategoryInfo.title,
        label: parentCategoryInfo.title,
        value: `/${parentCategoryInfo.deliveryKey}`,
        openInNewTab: false
      },
      {
        key: projectPage?.title,
        label: projectPage?.title,
        value: '',
        openInNewTab: false
      }
    ]
  };

  return {
    props: {
      projectPage,
      projectBcrumbs: diyBreadCrumbs
    }
  };
}
