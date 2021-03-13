export interface IStorage {
  addItem(item: string): Promise<void>;
  getAllItems(): Promise<string[]>;
  addItemToBag(userId: string, item: string): Promise<void>;
  getItemsInBag(userId: string): Promise<string[]>;
  clearBag(userId: string): Promise<void>;
}
