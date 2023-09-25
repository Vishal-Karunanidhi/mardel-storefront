import AccordionSlot from '@Components/productDetailPage/accordianSlot';
import { cookieBannerExtension } from '@Lib/common/utility';
import { ContentMainSection } from '@Types/cms/schema/contentPage.schema';

import ContentStyles from '@Styles/contentPage/contentPageComponents.module.scss';

/* TODO: Refactor all other contentPage instances to utilize this method here and eliminate code duplication across the pages. */
const ContentPageMainSection = ({ mainSection }) => {
  return (
    <div className={ContentStyles.contentPageMainSection}>
      {mainSection?.map((section: ContentMainSection, index: number) => (
        <AccordionSlot
          key={index}
          title={section?.title}
          content={section?.richText}
          contentStyle={{ margin: 0 }}
          markdownExtension={[cookieBannerExtension]}
        />
      ))}
    </div>
  );
};

export { ContentPageMainSection };
