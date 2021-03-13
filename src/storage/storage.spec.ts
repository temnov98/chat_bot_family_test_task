import { InMemoryStorage } from "./in-memory.storage";
import { IStorage } from "./storage.interface";

describe('InMemoryStorage', () => {
  let storages: IStorage[];

  beforeEach(() => {
    storages = [
      new InMemoryStorage(),
      // TODO: add other storages later
    ];
  });

  it('items', async () => {
    for (const storage of storages) {
      const items: string[] = ['1', '2', '3', '4'];
      for (const item of items) {
        await storage.addItem(item);
      }

      const itemsFromStorage = await storage.getAllItems();

      expect(itemsFromStorage.sort()).toEqual(items.sort());
    }    
  });

  it('items with expcetions', async () => {
    for (const storage of storages) {
      const items: string[] = ['1', '2', '3', '4'];
      for (const item of items) {
        await storage.addItem(item);
  
        // this item already exists
        await expect(storage.addItem(item)).rejects.toThrow();
      }
    }
  });

  it('empty bag', async () => {
    for (const storage of storages) {
      const items: string[] = ['1', '2', '3', '4'];
      for (const item of items) {
        await storage.addItem(item);
      }
  
      const itemsFromStorage1 = await storage.getItemsInBag('user_1');
      expect(itemsFromStorage1).toEqual([]);
  
      const itemsFromStorage2 = await storage.getItemsInBag('user_2');
      expect(itemsFromStorage2).toEqual([]); 
    }
  });
  
  it('not empty bag', async () => {
    for (const storage of storages) {
      const items: string[] = ['1', '2', '3', '4'];
      for (const item of items) {
        await storage.addItem(item);
      }
  
      await storage.addItemToBag('user_1', '1');
      await storage.addItemToBag('user_1', '1');
      await storage.addItemToBag('user_1', '3');
  
      await storage.addItemToBag('user_2', '2');
      await storage.addItemToBag('user_2', '3');
      await storage.addItemToBag('user_2', '4');
      await storage.addItemToBag('user_2', '4');
  
      const itemsFromStorage1 = await storage.getItemsInBag('user_1');
      expect(itemsFromStorage1.sort()).toEqual(['1', '1', '3'].sort());
  
      const itemsFromStorage2 = await storage.getItemsInBag('user_2');
      expect(itemsFromStorage2.sort()).toEqual(['2', '3', '4', '4'].sort());
  
      const itemsFromStorage3 = await storage.getItemsInBag('user_3');
      expect(itemsFromStorage3).toEqual([]); 
    }
  });

  it('clear bag', async () => {
    for (const storage of storages) {
      const items: string[] = ['1', '2', '3', '4'];
      for (const item of items) {
        await storage.addItem(item);
      }
  
      await storage.addItemToBag('user_1', '1');
      await storage.addItemToBag('user_1', '1');
      await storage.addItemToBag('user_1', '3');
  
      const itemsFromStorage1 = await storage.getItemsInBag('user_1');
      expect(itemsFromStorage1.sort()).toEqual(['1', '1', '3'].sort());
  
      await storage.clearBag('user_1');
  
      const itemsFromStorage2 = await storage.getItemsInBag('user_1');
      expect(itemsFromStorage2).toEqual([]); 
    }
  });
});
