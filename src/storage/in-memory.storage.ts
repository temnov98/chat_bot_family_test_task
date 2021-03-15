import { injectable } from "inversify";
import { Types } from "../types";
import { ItemModel } from "./item.model";

@injectable()
export class InMemoryStorage implements Types.Storage.TYPE {
  // #region Private Fields

  private readonly itemIdToItem: Map<string, ItemModel> = new Map();
  private readonly userIdToItemIdsInBag: Map<string, string[]> = new Map();
  private readonly orderIdToItemsInBag: Map<string, string[]> = new Map();

  // #endregion

  // #region Public Methods

  public async addItem(name: string): Promise<Readonly<ItemModel>> {
    const item: ItemModel = {
      name,
      id: Date.now().toString(),
    };

    this.itemIdToItem.set(item.id, item);
    return item;
  }

  public async getAllItems(): Promise<Readonly<ItemModel>[]> {
    return [...this.itemIdToItem.values()];
  }

  public async getItemById(itemId: string): Promise<Readonly<ItemModel> | undefined> {
    return this.itemIdToItem.get(itemId);
  }

  public async addItemToBag(userId: string, itemId: string): Promise<void> {
    const item = await this.getItemById(itemId);
    if (!item) {
      throw new Error('Item not found');
    }

    const bag: string[] = this.userIdToItemIdsInBag.get(userId) || [];
    bag.push(item.id);
    this.userIdToItemIdsInBag.set(userId, bag);
  }

  public async getItemsInBag(userId: string): Promise<Readonly<ItemModel>[]> {
    const ids: string[] = this.userIdToItemIdsInBag.get(userId) || [];
    return ids.map(id => this.itemIdToItem.get(id)!);
  }

  public async clearBag(userId: string): Promise<void> {
    this.userIdToItemIdsInBag.delete(userId);
  }

  public async payOrder(userId: string): Promise<{ orderId: string }> {
    const orderId = Date.now().toString();

    const ids: string[] = this.userIdToItemIdsInBag.get(userId) || [];
    this.orderIdToItemsInBag.set(orderId, ids);

    return { orderId };
  }

  // #endregion
}
