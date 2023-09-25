import { SORT_BY_MAP } from '@Constants/categoryConstants';

type PlpCtxProps = {
  hitsPerPage?: number;
  searchKey?: string;
  selctedGiftCardPrice?: number;
  purchaseRange?: object;
  recipientEmail?: string;
};

const initialLayoutState: PlpCtxProps = {
  hitsPerPage: 12,
  searchKey: '',
  selctedGiftCardPrice: 25,
  purchaseRange: {
    minPurchaseAmount: 10,
    maxPurchaseAmount: 200
  },
  recipientEmail: ''
};

const PlpReducer = (state = initialLayoutState, { type, payload }) => {
  let currState = state;
  switch (type) {
    case 'UPDATE_HITS_PER_PAGE':
      currState = { hitsPerPage: payload };
      break;

    case 'UPDATE_SEARCH_KEY':
      currState = { searchKey: payload };
      break;

    case 'UPDATE_SELECTED_GIFTCARD_AMOUNT':
      currState = { selctedGiftCardPrice: payload };
      break;

    case 'UPDATE_GIFT_CARDS_CMS_DATA':
      currState = { purchaseRange: payload };
      break;

    case 'UPDATE_GIFTCARD_RECIPIENT_EMAIL':
      currState = { recipientEmail: payload };
  }

  return {
    ...state,
    ...currState
  };
};

export default PlpReducer;
