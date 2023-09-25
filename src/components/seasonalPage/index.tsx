import { useState, useEffect } from 'react';
import CategorySlider from '../landingPage/department/components/categorySlider';
import SecondaryPromotion from '@Components/homepage/secondaryPromotion';
import SeoContent from '../landingPage/department/components/seoContent';
import ShopSale from '../landingPage/department/components/shopSale';
import styles from '@Styles/landingPages/departmentLandingPage/seasonalDepartmentPage.module.scss';
import TopCategories from '../landingPage/department/components/topCategories';

function SeasonalDepartmentPage({ pageData, categories }) {
  const [primaryPromo, setPrimaryPromo] = useState<any>({});
  const [secondaryPromo, setSecondaryPromo] = useState<any>({});
  const [seoDescription, setSeoDescription] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [shopSale, setShopSale] = useState([]);
  const [topCategories, setTopCategories] = useState([]);

  useEffect(() => {
    if (pageData.carousel) {
      setShopSale(pageData.carousel.shopSale);
      setTopCategories(pageData.carousel.topCategories);
    }
    if (pageData.seoContent) {
      setSeoTitle(pageData.seoContent.title);
      setSeoDescription(pageData.seoContent.description);
    }
    if (pageData.promos) {
      setPrimaryPromo(pageData.promos.primary);
      setSecondaryPromo(pageData.promos.secondary);
    }
  }, [pageData]);

  return (
    <>
      <div className={styles.body}>
        <div className={styles.gridContainerSeasonal}>
          {categories && <CategorySlider cards={categories} labels={pageData.labels} />}
          {primaryPromo && primaryPromo.media && (
            <SecondaryPromotion
              Promos={[primaryPromo]}
              style={{ marginLeft: 0, marginRight: 0, marginTop: 80, padding: 0 }}
              gridStyle={{ margin: 0, padding: 0 }}
            />
          )}
          {shopSale && <ShopSale cards={shopSale} labels={pageData.labels} />}
          {topCategories && <TopCategories cards={topCategories} labels={pageData.labels} />}
        </div>
        {secondaryPromo && secondaryPromo.Promos && (
          <SecondaryPromotion
            Promos={secondaryPromo.Promos}
            gridStyle={{ margin: 0, padding: '105px 0px 70px 0px' }}
          />
        )}
        <SeoContent title={seoTitle} description={seoDescription} />
      </div>
    </>
  );
}

export default SeasonalDepartmentPage;
