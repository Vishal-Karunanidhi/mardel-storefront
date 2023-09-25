import { DrawerHeader } from '@Components/cartPage/miniCartDrawer';
import ProductCard from '@Components/slider/cards/productCard';
import { Drawer } from '@mui/material';
import styles from '@Styles/components/common/shopImageDrawer.module.scss';
import EastIcon from '@mui/icons-material/East';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Ga4EcommerceItem } from 'src/interfaces/ga4EcommerceItem';
import { handleProductViewListEvent } from '@Lib/common/utility';
import { useSelector } from '@Redux/store';

export default function ShopImageDrawer({ open, onClose, products }) {
  const router = useRouter();
  const {
    heartBeatInfo: { sessionId, isLoggedInUser }
  } = useSelector((state) => state.auth);

  // View all products button will be implemented later as part of phase two
  // Leave examples here for when we implement the View all products button

  // Example of what I want to do.
  // Retrieve multiple products - DOES NOT WORK
  const productSkus: string = products
    .map((product) => `objectID:${product.productKey.split('-')[1]}`)
    .join(' OR ');
  const searchURL = `search?filter=(${productSkus})`;

  // Example of searching for a single product - WORKS
  // const productSkus = `${products[0].variants[0].sku}`;
  // const searchURL = `search?text=${productSkus}`;

  useEffect(() => {
    if (window) {
      const items = products.map((product) => {
        const {
          price: { discountedPrice, variantPrice }
        } = product.variants.at(0);
        return {
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
          item_id: product.productKey,
          item_list_id: '',
          item_list_name: '',
          item_name: product.name,
          item_variant: '',
          price: discountedPrice ? discountedPrice?.discountedPrice : variantPrice,
          quantity: 1
        } as Ga4EcommerceItem;
      });

      if (items.length > 0) {
        handleProductViewListEvent(items, 'look book page', sessionId, isLoggedInUser);
      }
    }
  }, []);

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <DrawerHeader title="EXPLORE ITEMS" closeHandler={onClose} />
      <div className={styles.shopImageProducts}>
        {products.map((product, index) => (
          // TODO - Be more accurate about the page type
          // This component is used on more than just the look book
          <ProductCard key={index} productData={product} pageType="look book page" />
        ))}
      </div>
      <div className={styles.shopImageFooter}>
        {false && (
          <button onClick={() => router.push(searchURL)}>
            View all products <EastIcon />
          </button>
        )}
      </div>
    </Drawer>
  );
}
