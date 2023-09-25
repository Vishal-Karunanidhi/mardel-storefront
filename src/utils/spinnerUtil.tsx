const spinerType = 'LOAD_SPINNER';
const spinnerStart = {
  type: spinerType,
  payload: {
    isVisible: true,
    className: '',
    isInitialLoading: false,
    isMenuClicked: false,
    page: {
      type: '',
      isInitialLoading: true
    }
  }
};

const spinnerEnd = {
  type: spinerType,
  payload: {
    isVisible: false,
    className: '',
    isInitialLoading: false,
    isMenuClicked: false,
    page: {
      type: '',
      isInitialLoading: false
    }
  }
};

export { spinnerStart, spinnerEnd };
