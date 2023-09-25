import { useState, useEffect } from 'react';
import CategorySlider from './components/categorySlider';
import FeaturedItems from '@Components/homepage/featuredItems';
import SecondaryPromotion from '@Components/homepage/secondaryPromotion';
import SeoContent from './components/seoContent';
import ShopSale from './components/shopSale';
import SideNav from './components/sideNav';
import styles from '@Styles/landingPages/departmentLandingPage/departmentPage.module.scss';
import TopCategories from './components/topCategories';

function DepartmentPage({ recentlyViewed, pageData, categories, currentUrl }) {
  const [shopSale, setShopSale] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [primaryPromo, setPrimaryPromo] = useState<any>({});
  const [secondaryPromo, setSecondaryPromo] = useState<any>({});

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
    <div className={styles.body}>
      <div className={styles.gridContainer}>
        <div className={styles.left}>
          <SideNav categories={categories || []} currentUrl={currentUrl} />
        </div>
        <div className={styles.right}>
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
      </div>
      {secondaryPromo && secondaryPromo.Promos && (
        <SecondaryPromotion
          Promos={secondaryPromo.Promos}
          gridStyle={{ margin: 0, padding: '105px 0px 70px 0px' }}
        />
      )}
      {recentlyViewed.length != 0 && (
        <div className={`${styles.departmentSlider} ${styles.slider}`}>
          <FeaturedItems label="Recently Viewed" products={recentlyViewed} />
        </div>
      )}
      <SeoContent title={seoTitle} description={seoDescription} />
    </div>
  );
}

export default DepartmentPage;
