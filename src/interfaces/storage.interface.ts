export interface IStorage {
  addItem(item: string): Promise<void>;
  getAllItems(): Promise<string[]>;
  itemExists(item: string): Promise<boolean>;
  addItemToBag(userId: string, item: string): Promise<void>;
  getItemsInBag(userId: string): Promise<string[]>;
  clearBag(userId: string): Promise<void>;
  payOrder(userId: string): Promise<string>;
}
