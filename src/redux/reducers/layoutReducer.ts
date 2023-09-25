import { defaultPageType } from '@Constants/generalConstants';
import { SORT_BY_MAP, SORT_BY_KEY_TO_INDEX, DIY_SORT_BY_MAP, DIY_SORT_BY_KEY_TO_INDEX } from '@Constants/categoryConstants';

type LayoutCtxProps = {
  lineItemCount?: number;
  stepperHeaderNumber?: number;
  currentRefinedSortBy?: string;
  currentRefinedDIYSortBy?: string
  currentSelectedIndex?: string;
  currentDIYSelectedIndex?: string;
  privacyTermsCmsData?: Object;
  pageType?: Object;
  recentlyViewedKeys?: string[];
  openMiniCartDrawer?: boolean;
  openMegaNavDrawer?: boolean;
  toasterData?: Object;
  spinnerData?: Object;
  currentResolution?: string;
};

const initialLayoutState: LayoutCtxProps = {
  lineItemCount: 0,
  stepperHeaderNumber: 99,
  currentResolution: 'DESKTOP',
  currentRefinedSortBy: 'Relevance',
  currentRefinedDIYSortBy: 'Most Recent',
  currentSelectedIndex: SORT_BY_KEY_TO_INDEX?.['Relevance'],
  currentDIYSelectedIndex: DIY_SORT_BY_KEY_TO_INDEX?.['Most Recent'],
  privacyTermsCmsData: {},
  pageType: defaultPageType,
  recentlyViewedKeys: [,],
  openMiniCartDrawer: false,
  openMegaNavDrawer: false,
  toasterData: {
    open: false,
    message: '',
    severity: 'success'
  },
  spinnerData: {
    isVisible: false,
    className: '',
    isInitialLoading: true,
    isMenuClicked: false,
    page: {
      type: '',
      isInitialLoading: true
    }
  }
};

const LayoutReducer = (state = initialLayoutState, { type, payload }) => {
  let currState = state;
  switch (type) {
    case 'UPDATE_LINE_ITEM_COUNT':
      currState = { lineItemCount: payload.lineItemCount };
      break;
    case 'UPDATE_CHECKOUT_STEPPER':
      currState = { stepperHeaderNumber: payload.stepperHeaderNumber };
      break;
    case 'UPDATE_CURRENT_SORT_REFINEMENT':
      currState = { currentRefinedSortBy: SORT_BY_MAP[payload], currentSelectedIndex: payload };
      break;
    case 'GET_PRIVACYANDTERMS_CMS_DATA':
      currState = { privacyTermsCmsData: payload };
      break;
    case 'UPDATE_PAGE_TYPE':
      currState = { pageType: payload };
      break;
    case 'UPDATE_RECENTLY_VIEWED_PRODUCT_KEYS':
      currState = { recentlyViewedKeys: payload };
      break;
    case 'BOOT_MINI_CART':
      currState = { openMiniCartDrawer: payload };
      break;
    case 'BOOT_MEGA_NAV':
      currState = { openMegaNavDrawer: payload };
      break;
    case 'UPDATE_SNACKBAR_WITH_DATA':
      currState = { toasterData: payload };
      break;
    case 'LOAD_SPINNER':
      currState = { spinnerData: payload };
      break;
    case 'UPDATE_SCREEN_RESOLUTION':
      currState = { currentResolution: payload };
      break;
    case 'UPDATE_DIY_CURRENT_SORT_REFINEMENT':
      currState = { currentRefinedDIYSortBy: DIY_SORT_BY_MAP[payload], currentDIYSelectedIndex: payload };
  }

  return {
    ...state,
    ...currState
  };
};

export default LayoutReducer;
