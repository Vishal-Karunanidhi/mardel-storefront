import styles from '@Styles/cartpage/miniCartDrawer.module.scss';

const PriceLabel = (props) => {
  const { isDiscountApplicable, originalPrice, discountedPrice } = props;
  return isDiscountApplicable ? (
    <label className={styles.amount}>${parseFloat(originalPrice).toFixed(2)}</label>
  ) : (
    <label className={styles.cartAmount}>
      <label style={{ color: '#B40000' }}>${parseFloat(discountedPrice).toFixed(2)} </label>
      <label style={{ textDecoration: 'line-through', fontWeight: 'normal', marginLeft: 4 }}>
        ${parseFloat(originalPrice).toFixed(2)}
      </label>
    </label>
  );
};

export { PriceLabel };
