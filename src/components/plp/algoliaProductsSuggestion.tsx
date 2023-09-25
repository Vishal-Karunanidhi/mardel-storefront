import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AlgoliaFeaturedItems from './algoliaFeaturedItems';
import { getRelatedProducts } from '@Lib/cms/productDetailsPage';
import styles from '@Styles/productDetailPage/pdpIndex.module.scss';

export default function AlgoliaProductsSuggestion(props: any) {
  const router = useRouter();
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  useEffect(() => {
    async function getProductsRecommendations() {
      const objectId = router?.asPath?.split('/p/')?.[1] ?? '';
      const { hits } = await getRelatedProducts(objectId);
      const recommendedProductKeys = hits?.map((product) => {
        return {
          ...product,
          ['sku.discountedPrice']: product?.skudiscountedPrice,
          ['variant.price']: product?.variantprice,
          ['ratings.count']: product?.ratingscount,
          ['ratings.average']: product?.ratingsaverage
        };
      });
      setRecommendedProducts(recommendedProductKeys);
    }
    getProductsRecommendations();
  }, []);

  return (
    <>
      {!!recommendedProducts?.length && (
        <div className={styles.itemsToConsider}>
          <AlgoliaFeaturedItems label="Items to Consider" products={recommendedProducts} />
        </div>
      )}
    </>
  );
}
