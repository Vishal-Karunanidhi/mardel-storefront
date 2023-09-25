import { CartGtmDataLayer, TransactionProduct } from 'src/interfaces/gtmDataLayer';
import { OrderDetails } from 'src/interfaces/orderDetails';

// pageType defaults to `cart`
const populateGtmDataFromOrderDetails = (pageType: string = 'cart', orderDetails: OrderDetails) => {
  // defaulting values
  const cartGtmDataLayer: CartGtmDataLayer = {
    anonymousUserId: orderDetails.anonymousId,
    event: 'page_view', // assumes a page view by default
    pageType: pageType,
    paymentMethod: '',
    shipping: '',
    t_Coupon: null,
    tax: '',
    transactionId: '',
    transactionProducts: [],
    transactionSubtotal: 0, // Commission Junction (CJ)
    transactionTotal: '',
    wholeOrderDiscount: 0 // Commission Junction (CJ)
  };
  // TODO: invert this and handle null, the `cartInfo` object should always exist
  if (orderDetails) {
    cartGtmDataLayer.transactionId = orderDetails.id;

    if (orderDetails.paymentDetails) {
      // ASSUMPTION: we want to capture all methods of payment that exist
      // TODO: optimize
      let paymentMethodArray = [];

      if (
        orderDetails.paymentDetails.paymentClassification.applePay &&
        orderDetails.paymentDetails.paymentClassification.applePay != 'undefined'
      ) {
        paymentMethodArray.push('ApplePay');
      }
      if (
        orderDetails.paymentDetails.paymentClassification.paypal &&
        orderDetails.paymentDetails.paymentClassification.paypal != 'undefined'
      ) {
        paymentMethodArray.push('PayPal');
      }
      if (
        orderDetails.paymentDetails.paymentClassification.giftCard &&
        orderDetails.paymentDetails.paymentClassification.giftCard != 'undefined'
      ) {
        paymentMethodArray.push('GiftCard');
      }
      if (
        orderDetails.paymentDetails.paymentClassification.creditCard &&
        orderDetails.paymentDetails.paymentClassification.creditCard != 'undefined'
      ) {
        paymentMethodArray.push('CreditCard');
      }

      cartGtmDataLayer.paymentMethod = paymentMethodArray.join(',');
    }

    if (orderDetails.orderSummary) {
      cartGtmDataLayer.shipping = `\$${orderDetails.orderSummary.standardShipping}`;
      cartGtmDataLayer.tax = `\$${orderDetails.orderSummary.totalTax}`;
      cartGtmDataLayer.transactionSubtotal = orderDetails.orderSummary.merchandiseSubTotal;
      cartGtmDataLayer.transactionTotal = `\$${orderDetails.orderSummary.totalPrice}`;
      cartGtmDataLayer.wholeOrderDiscount = orderDetails.orderSummary.merchandiseDiscount;
    }

    if (orderDetails.lineItems) {
      var transactionProducts: TransactionProduct[] = [];

      orderDetails.lineItems.forEach((lineItem) => {
        // defaulting values
        const newTransationProduct: TransactionProduct = {
          category: null,
          department: null,
          inStock: null,
          inStoreOnly: 'no',
          new: null,
          oosOnline: null,
          subcategory: null,
          entryTotal: '',
          name: '',
          price: '',
          quantity: 0,
          sku: '',
          onlineOnly: '',
          onSale: ''
        };

        // populate based
        if (lineItem) {
          newTransationProduct.entryTotal = `\$${lineItem.totalPrice}`;
          newTransationProduct.name = lineItem.name;
          newTransationProduct.price = `\$${lineItem.originalPricePerQuantity}`;
          newTransationProduct.quantity = lineItem.quantity;

          if (lineItem?.variant) {
            newTransationProduct.sku = lineItem.variant.sku;

            if (lineItem?.variant?.attributes) {
              newTransationProduct.brand = lineItem.variant.attributes.brand?.label ?? '';
              newTransationProduct.collection = lineItem.variant.attributes.collection?.label ?? '';
              newTransationProduct.color = lineItem.variant.attributes.color?.label ?? '';
              newTransationProduct.inStoreOnly =
                lineItem.variant.attributes.availability?.key === 'in_store_only' ? 'yes' : 'no';
              // TODO: double check this
              newTransationProduct.onSale =
                lineItem.variant.attributes.saleType === null ? 'no' : 'yes';
              newTransationProduct.pattern = lineItem.variant.attributes.pattern?.label ?? '';

              if (lineItem.variant.attributes.onlineStatus) {
                // TODO: double check this
                newTransationProduct.onlineOnly =
                  lineItem.variant.attributes.onlineStatus.key === 'online' ? 'yes' : 'no';
              }

              if (lineItem.variant.attributes.theme) {
                newTransationProduct.theme = lineItem.variant.attributes.theme.label;
              }
            }
          }
        }

        transactionProducts.push(newTransationProduct);
      });

      cartGtmDataLayer.transactionProducts = transactionProducts;
    }
  }
  return cartGtmDataLayer;
};

export { populateGtmDataFromOrderDetails };
