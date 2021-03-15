import { inject, injectable } from "inversify";
import { Types } from "../types";
import { ItemModel } from "./item.model";
import { Connection, createConnection } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { ItemEntity } from "./entity/item.entity";
import { OrderEntity } from "./entity/order.entity";
import { OrderItemEntity } from "./entity/order-item.entity";
import { BagEntity } from "./entity/bag.entity";
import { v4 } from "uuid";

@injectable()
export class SQLiteStorage implements Types.Storage.TYPE {
  // #region private Fields

  private connection!: Connection;

  // #endregion

  // #region Public Methods

  constructor(
    // в конструкторе, потому что используется в initConnection. Через Property не будет работать
    @inject(Types.ConfigsService.TOKEN)
    private readonly configsService: Types.ConfigsService.TYPE,

    @inject(Types.StorageConfig.TOKEN)
    private readonly storageConfig: Types.StorageConfig.TYPE,
  ) {
    if (storageConfig.initConnection) {
      this.initConnection();
    }
  }

  public async initConnection() {
    this.connection = await createConnection({
      type: "sqlite",
      database: this.configsService.database.database,
      migrationsTableName: this.configsService.database.migrations.tableName,
      migrationsRun: this.configsService.database.migrations.run,
      synchronize: this.configsService.database.synchronize,
      logging: this.configsService.database.logging,
      namingStrategy: new SnakeNamingStrategy(),
      entities:  [ (this.configsService.tsNode) ? 'src/**/*.entity.ts' : 'dist/**/*.entity.js' ],
      migrations:  [ (this.configsService.tsNode) ? 'src/**/*Migration.ts' : 'dist/**/*Migration.js' ],
      migrationsTransactionMode: "each",
    });
  }

  public async closeConnection(): Promise<void> {
    await this.connection.close();
  }

  public async addItem(name: string): Promise<Readonly<ItemModel>> {
    const entity = new ItemEntity();
    entity.id = this.createId();
    entity.name = name;

    return await this.itemsRepository.save(entity);
  }

  public async getAllItems(): Promise<Readonly<ItemModel>[]> {
    return await this.itemsRepository.find();
  }

  public async getItemById(itemId: string): Promise<Readonly<ItemModel> | undefined> {
    return await this.itemsRepository.findOne({
      where: {
        id: itemId,
      },
    });
  }

  public async addItemToBag(userId: string, itemId: string): Promise<void> {
    const entity = new BagEntity();
    entity.id = this.createId();
    entity.item = { id: itemId } as ItemEntity; // for correct saving
    entity.userId = userId;
    
    await this.bagsRepository.save(entity);
  }

  public async getItemsInBag(userId: string): Promise<Readonly<ItemModel>[]> {
    const result = await this.bagsRepository.find({
      where: {
        userId,
      },
      relations: ['item'],
    });

    return result.map(item => item.item);
  }

  public async clearBag(userId: string): Promise<void> {
    await this.bagsRepository.delete({
      userId,
    });
  }

  public async payOrder(userId: string): Promise<{ orderId: string }> {
    const itemsInBag = await this.bagsRepository.find({
      where: {
        userId,
      },
    });

    if (itemsInBag.length === 0) {
      throw new Error('Empty bag');
    }

    const orderEntity = new OrderEntity();
    orderEntity.id = this.createId();
    orderEntity.userId = userId;
    orderEntity.creationDate = new Date();

    const savedOrderEntity = await this.ordersRepository.save(orderEntity);

    const orderItems: OrderItemEntity[] = [];
    for (const item of itemsInBag) {
      const orderItemEntity = new OrderItemEntity();
      orderItemEntity.id = this.createId();
      orderItemEntity.item = { id: item.itemId } as ItemEntity; // for correct saving
      orderItemEntity.order = savedOrderEntity;

      orderItems.push(orderItemEntity);
    }

    await this.ordersItemsRepository.save(orderItems);
    return {
      orderId: savedOrderEntity.id,
    };
  }

  // #endregion

  // #region private Methods

  private createId(): string {
    return v4();
  }

  private get itemsRepository() {
    return this.connection.getRepository(ItemEntity);
  }

  private get ordersRepository() {
    return this.connection.getRepository(OrderEntity);
  }

  private get ordersItemsRepository() {
    return this.connection.getRepository(OrderItemEntity);
  }

  private get bagsRepository() {
    return this.connection.getRepository(BagEntity);
  }

  // #endregion
}
