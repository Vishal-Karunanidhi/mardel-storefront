import { fetchGqlData, modifyDataViaGql } from '@Graphql/client';

import DeleteListGql from '@GqlMutations/shoppingList/deleteList.graphql';
import CreateListGql from '@GqlMutations/shoppingList/createList.graphql';
import AddItemToListGql from '@GqlMutations/shoppingList/addItemToList.graphql';
import ReNameListGql from '@GqlMutations/shoppingList/reNameList.graphql';
import DeleteItemFromListGql from '@GqlMutations/shoppingList/deleteItemFromList.graphql';

import GetMyShoppingListsGQL from '@GqlQueries/shoppingList/getMyAllShoppingLists.graphql';
import GetMyIndividualShoppingListGql from '@GqlQueries/shoppingList/getMyUniqueShoppingList.graphql';
import GetMultipleUniqueShoppingListGql from '@GqlQueries/shoppingList/getMultipleUniqueShoppingList.graphql';

import GetSharedShoppingListUrl from '@GqlQueries/shoppingList/getSharedShoppingListUrl.graphql';
import ViewSharedShoppingList from '@GqlQueries/shoppingList/viewSharedShoppingList.graphql';
import ShareShoppingList from '@GqlMutations/shoppingList/shareList.graphql';

import {
  AddItemToListResponse,
  CreateListResponse,
  DeleteItemFromListResponse,
  ListResponse,
  ListsResponse,
  ShareListPayload
} from '@Types/cms/shoppingList';

/* Mutation for Customer Shopping Wishlist */
export async function createShoppingList(
  listName: string = 'My list'
): Promise<CreateListResponse | null> {
  const gqlArguments = { listName };
  try {
    const { data } = await modifyDataViaGql(CreateListGql, gqlArguments);
    return data.createList;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function addItemToShoppingList(
  productKey: string,
  skuId: string,
  listId?: string
): Promise<AddItemToListResponse | null> {
  const gqlArguments = { productKey: `${productKey}`, skuId: `${skuId}`, listId: `${listId}` };
  try {
    const { data } = await modifyDataViaGql(AddItemToListGql, gqlArguments);
    return data.addItemToList;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function deleteItemToShoppingList(
  itemId: string,
  listId?: string
): Promise<DeleteItemFromListResponse | null> {
  const gqlArguments = { itemId: `${itemId}`, listId: `${listId}` };
  try {
    const { data } = await modifyDataViaGql(DeleteItemFromListGql, gqlArguments);
    return data.deleteItemFromList;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function deleteShoppingList(listId: string) {
  const gqlArguments = { listId };
  try {
    const response = await modifyDataViaGql(DeleteListGql, gqlArguments);
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
}

/* Queries for Customer Shopping Wishlist */
export async function getShoppingListsWithItems(
  pageNumber?: number,
  itemsPerPage?: number
): Promise<ListsResponse | null> {
  const variables = { pageNumber, itemsPerPage };
  try {
    const { getMyAllShoppingLists } = await fetchGqlData(GetMyShoppingListsGQL, variables);
    return getMyAllShoppingLists;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getShoppingLists(
  pageNumber?: number,
  itemsPerPage?: number
): Promise<ListsResponse | null> {
  const variables = { pageNumber, itemsPerPage };
  try {
    const { getMyAllShoppingLists } = await fetchGqlData(GetMyShoppingListsGQL, variables);
    return getMyAllShoppingLists;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getShoppingList(
  listId: string,
  pageNumber?: number,
  itemsPerPage?: number
): Promise<ListResponse | null> {
  const variables = { listId: `${listId}`, pageNumber, itemsPerPage };
  try {
    const { getMyUniqueShoppingList } = await fetchGqlData(
      GetMyIndividualShoppingListGql,
      variables
    );
    return getMyUniqueShoppingList;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getMultipleUniqueShoppingList(
  listIdArray: [string],
  pageNumber?: number,
  itemsPerPage?: number
): Promise<ListResponse | null> {
  const variables = { listIdArray: listIdArray.map((e) => `${e}`), pageNumber, itemsPerPage };
  try {
    const { getMultipleUniqueShoppingList } = await fetchGqlData(
      GetMultipleUniqueShoppingListGql,
      variables
    );
    return getMultipleUniqueShoppingList;
  } catch (error) {
    console.error(error);
    return null;
  }
}

/* Mutation for ReName Shopping Wishlist */
export async function reNameShoppingList(
  listName: string,
  listId?: string
): Promise<AddItemToListResponse | null> {
  const gqlArguments = { listName, listId };
  try {
    const { data } = await modifyDataViaGql(ReNameListGql, gqlArguments);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getShoppingListUrl(listId: string) {
  const gqlArguments = { listId };
  try {
    const { getSharedShoppingListUrl } = await fetchGqlData(GetSharedShoppingListUrl, gqlArguments);
    return getSharedShoppingListUrl;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function viewShoppingList(sharedUrl: string) {
  const gqlArguments = { sharedUrl };
  try {
    const { viewSharedShoppingList } = await fetchGqlData(ViewSharedShoppingList, gqlArguments);
    return viewSharedShoppingList;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function shareShoppingList(request: ShareListPayload) {
  const gqlArguments = { request };
  try {
    const response = await fetchGqlData(ShareShoppingList, gqlArguments);
    return response?.shareList;
  } catch (error) {
    console.error(error);
    return null;
  }
}
