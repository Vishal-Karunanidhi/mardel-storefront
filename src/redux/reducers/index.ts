import { combineReducers } from 'src/redux/store';
import LayoutReducer from '@Redux/reducers/layoutReducer';
import AuthReducer from '@Redux/reducers/authReducer';
import MyAccountReducer from '@Redux/reducers/myAccountReducer';
import ShoppingListReducer from '@Redux/reducers/shoppingListReducer';
import PlpReducer from '@Redux/reducers/plpReducer';
import CheckoutReducer from '@Redux/reducers/checkoutReducer';

export default combineReducers({
  layout: LayoutReducer,
  auth: AuthReducer,
  myAccount: MyAccountReducer,
  plp: PlpReducer,
  checkout: CheckoutReducer,
  list: ShoppingListReducer
});
