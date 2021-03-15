import "reflect-metadata";
import { InMemoryStorage } from "./in-memory.storage";
import { IStorage } from "../interfaces/storage.interface";
import { SQLiteStorage } from './sqlite.storage';
import { v4 } from "uuid";

describe('InMemoryStorage', () => {
  it('items', async () => {
    const { storages, sqliteStorage } = await createStorages();
    await sqliteStorage.initConnection();

    for (const storage of storages) {
      const items: string[] = ['1', '2', '3', '4'];
      for (const item of items) {
        await storage.addItem(item);
      }

      const itemsFromStorage = await storage.getAllItems();

      expect(itemsFromStorage.map(item => item.name).sort()).toEqual(items.sort());
    }

    await sqliteStorage.closeConnection();
  });

  it('items with exceptions', async () => {
    const { storages, sqliteStorage } = await createStorages();
    await sqliteStorage.initConnection();

    for (const storage of storages) {
      const items: string[] = ['1', '2', '3', '4'];
      for (const item of items) {
        await storage.addItem(item);
      }
    }

    await sqliteStorage.closeConnection();
  });

  it('empty bag', async () => {
    const { storages, sqliteStorage } = await createStorages();
    await sqliteStorage.initConnection();

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

    await sqliteStorage.closeConnection();
  });
  
  it('not empty bag', async () => {
    const { storages, sqliteStorage } = await createStorages();
    await sqliteStorage.initConnection();

    for (const storage of storages) {
      const itemsFor1 = ['1', '3'];
      const itemsFor2 = ['2', '3', '4'];

      const items: string[] = ['1', '2', '3', '4'];
      for (const item of items) {
        const result = await storage.addItem(item);

        if (itemsFor1.includes(item)) {
          await storage.addItemToBag('user_1', result.id);
        }

        if (itemsFor2.includes(item)) {
          await storage.addItemToBag('user_2', result.id);
        }
      }
  
      const itemsFromStorage1 = await storage.getItemsInBag('user_1');
      expect(itemsFromStorage1.map(item => item.name).sort()).toEqual(itemsFor1.sort());
  
      const itemsFromStorage2 = await storage.getItemsInBag('user_2');
      expect(itemsFromStorage2.map(item => item.name).sort()).toEqual(itemsFor2.sort());
  
      const itemsFromStorage3 = await storage.getItemsInBag('user_3');
      expect(itemsFromStorage3).toEqual([]); 
    }

    await sqliteStorage.closeConnection();
  });

  it('clear bag', async () => {
    const { storages, sqliteStorage } = await createStorages();
    await sqliteStorage.initConnection();

    for (const storage of storages) {
      const itemsFor1 = ['1', '3'];

      const items: string[] = ['1', '2', '3', '4'];
      for (const item of items) {
        const result = await storage.addItem(item);

        if (itemsFor1.includes(item)) {
          await storage.addItemToBag('user_1', result.id);
        }
      }
  
      const itemsFromStorage1 = await storage.getItemsInBag('user_1');
      expect(itemsFromStorage1.map(item => item.name).sort()).toEqual(itemsFor1.sort());
  
      await storage.clearBag('user_1');
  
      const itemsFromStorage2 = await storage.getItemsInBag('user_1');
      expect(itemsFromStorage2).toEqual([]); 
    }

    await sqliteStorage.closeConnection();
  });
});

function createStorages(): IStorages {
  const sqliteStorage = new SQLiteStorage({
    database: {
      database: `.test_data/.test_${v4()}.sql`,
      logging: false,
      migrations: {
        run: true,
        tableName: 'migrations',
      },
      synchronize: false,
    },
    tsNode: true,
    telegram: {
      adminChatId: 'mock',
      botToken: 'mock',
    },
  }, {
    initConnection: false,
  });

  const inMemoryStorage = new InMemoryStorage();

  return {
    inMemoryStorage,
    sqliteStorage,
    storages: [inMemoryStorage, sqliteStorage],
  };
}

interface IStorages {
  inMemoryStorage: InMemoryStorage;
  sqliteStorage: SQLiteStorage;
  storages: IStorage[];
}
