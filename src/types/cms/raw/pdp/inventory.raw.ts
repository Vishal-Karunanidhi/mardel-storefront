import { InventoryResponse } from '../../schema/pdp/inventory.schema';

type InventoryTypeRaw = {
  data: {
    getInventoryDetails: InventoryResponse;
  };
};

export type { InventoryTypeRaw };
