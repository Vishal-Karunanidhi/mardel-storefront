type InventoryResponse = {
  __typename: string;
  inventoryItems: InventoryItems[];
  productsNotFound: string[];
};

type InventoryItems = {
  __typename: string;
  productCode: string;
  totalCount: number;
};

export type { InventoryResponse, InventoryItems };
