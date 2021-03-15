import { ItemModel } from "src/storage/item.model";

export interface IStorage {
  addItem(name: string): Promise<Readonly<ItemModel>>;
  getAllItems(): Promise<Readonly<ItemModel>[]>;
  getItemById(itemId: string): Promise<Readonly<ItemModel> | undefined>;
  addItemToBag(userId: string, itemId: string): Promise<void>;
  getItemsInBag(userId: string): Promise<Readonly<ItemModel>[]>;
  clearBag(userId: string): Promise<void>;
  payOrder(userId: string): Promise<{ orderId: string }>;
}
