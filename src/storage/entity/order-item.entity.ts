import { Entity, ManyToOne, PrimaryColumn, RelationId } from "typeorm";
import { ItemEntity } from "./item.entity";
import { OrderEntity } from "./order.entity";

@Entity('orders_items')
export class OrderItemEntity {
  @PrimaryColumn()
  id!: string;

  @ManyToOne(() => OrderEntity, { nullable: false })
  order!: OrderEntity;

  @RelationId((orderItem: OrderItemEntity) => orderItem.order)
  orderId!: string;

  @ManyToOne(() => ItemEntity, { nullable: false })
  item!: ItemEntity;

  @RelationId((orderItem: OrderItemEntity) => orderItem.item)
  itemId!: string;
}
