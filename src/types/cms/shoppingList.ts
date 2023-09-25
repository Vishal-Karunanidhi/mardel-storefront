import { Variant } from './schema/pdp/pdpData.schema';

type ShoppingListItem = {
  id: number;
  productKey: string;
  skuId: string;
};

type Item = {
  id: number;
  productKey: number;
  skuId: number;
  product: ItemProduct;
};

type ItemProduct = Variant & { name: string; variantPicker: string };

type ListResponse = {
  listId: number;
  customerId: string;
  listName: string;
  itemCount: number;
  items: Item[];
  sort(compareFn?: (a: any, b: any) => number);
};

type ListsResponse = {
  shoppingListCount: number;
  totalPages: number;
  shoppingList: ListResponse[];
};

type CreateListResponse = {
  listId: number;
  customerId: string;
  listName: string;
};

type AddItemToListResponse = {
  listId: number;
  customerId: string;
  listName: string;
  itemCount: number;
  shoppingListItemList: ShoppingListItem[];
  renameList: {};
};

type DeleteItemFromListResponse = {
  status: number;
};

type ShareListPayload = {
  firstName: string;
  lastName: string;
  sharedUrl: string;
  email: string;
  senderName: string;
};

export type {
  Item,
  ListResponse,
  ListsResponse,
  CreateListResponse,
  AddItemToListResponse,
  DeleteItemFromListResponse,
  ShareListPayload
};
