import { injectable } from "inversify";
import { Types } from "../types";

@injectable()
export class InMemoryStorage implements Types.Storage.TYPE {
  // #region Private Fields

  private readonly items: Set<string> = new Set();
  private readonly userIdToBag: Map<string, string[]> = new Map();

  // #endregion

  // #region Public Methods

  public async addItem(item: string): Promise<void> {
    if (this.items.has(item)) {
      throw new Error('Item already exists');
    }

    this.items.add(item);
  }

  public async getAllItems(): Promise<string[]> {
    return [...this.items];
  }

  public async itemExists(item: string): Promise<boolean> {
    return this.items.has(item);
  }

  public async addItemToBag(userId: string, item: string): Promise<void> {
    if (!this.items.has(item)) {
      throw new Error('Item not found');
    }

    const bag: string[] = this.userIdToBag.get(userId) || [];
    bag.push(item);
    this.userIdToBag.set(userId, bag);
  }

  public async getItemsInBag(userId: string): Promise<string[]> {
    return this.userIdToBag.get(userId) || [];
  }

  public async clearBag(userId: string): Promise<void> {
    this.userIdToBag.delete(userId);
  }

  // #endregion
}
