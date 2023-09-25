type ListCtxProps = {
  shoppingLists?: object;
  currentList?: object;
  individualListData?: object;
};

const initialListState: ListCtxProps = {
  shoppingLists: [],
  currentList: {},
  individualListData: {
    seeAllClicked: false,
    listName: '',
    updateIndividualListBreadCrumb: {}
  }
};

const ShoppingListReducer = (state = initialListState, { type, payload }) => {
  let currState = state;

  switch (type) {
    case 'UPDATE_SHOPPING_LISTS':
      currState = { shoppingLists: payload };
      break;

    case 'UPDATE_CURRENT_LIST':
      currState = { currentList: payload };
      break;

    case 'UPDATE_INDIVIDUAL_LIST_BREADCRUMBS':
      currState = { individualListData: payload };
      break;
  }

  return {
    ...state,
    ...currState
  };
};

export default ShoppingListReducer;
