import { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import styles from '@Styles/homepage/featuredItems.module.scss';
import Slider from '@Components/slider/slider';
import ProductCard from '@Components/slider/cards/productCard';
import { getProductsByKeys } from '@Lib/cms';
import { Ga4EcommerceItem } from 'src/interfaces/ga4EcommerceItem';
import { handleProductViewListEvent } from '@Lib/common/utility';
import { useSelector } from '@Redux/store';

function FeaturedItems({ label, products }) {
  const [productDetails, setProductDetails] = useState<any>([]);

  const { heartBeatInfo } = useSelector((state) => state.auth) ?? {};

  useEffect(() => {
    async function getProductData(keys: string[]) {
      const productDetails = await getProductsByKeys(keys);
      setProductDetails(productDetails ?? []);
    }

    if (products?.length) {
      getProductData(products);
    }
  }, [products]);

  if (!products?.length) {
    <></>;
  }

  useEffect(() => {
    if (window && productDetails && productDetails.length > 0) {
      const ga4EcommerceItems = [];
      productDetails.forEach((productDetail) => {
        if (productDetail.variants) {
          const {
            price: { discountedPrice, variantPrice }
          } = productDetail.variants.at(0);
          ga4EcommerceItems.push({
            affiliation: '',
            coupon: '',
            currency: 'USD',
            discount: discountedPrice ? variantPrice - discountedPrice?.discountedPrice : 0,
            index: '',
            item_brand: '',
            item_category: '',
            item_category2: '',
            item_category3: '',
            item_category4: '',
            item_category5: '',
            item_id: productDetail.productKey,
            item_list_id: '',
            item_list_name: '',
            item_name: productDetail.name,
            item_variant: '',
            price: discountedPrice ? discountedPrice?.discountedPrice : variantPrice,
            quantity: 1
          } as Ga4EcommerceItem);
        }
      });

      if (ga4EcommerceItems.length > 0) {
        handleProductViewListEvent(
          ga4EcommerceItems,
          label,
          heartBeatInfo?.sessionId || '',
          heartBeatInfo?.isLoggedInUser || false
        );
      }
    }
  }, [productDetails]);

  return (
    <div className={styles.container}>
      <div className={styles.headerWrapper}>
        <Typography className={styles.header} variant="h2">
          {label}
        </Typography>
      </div>

      {productDetails?.length > 0 && (
        <Slider
          arrowPosition="50%"
          arrowSize="large"
          sliderStyle={{
            display: 'flex',
            alignContent: 'stretch',
            alignItems: 'stretch',
            gap: '24px'
          }}
          sliderTitle={label}
        >
          {productDetails.map((item: any, index: string | number) => (
            <ProductCard
              key={index}
              productData={item}
              pageType="featured items"
              productListName={label}
            />
          ))}
        </Slider>
      )}
    </div>
  );
}

export default FeaturedItems;
