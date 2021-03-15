import { Column, Entity, ManyToOne, PrimaryColumn, RelationId } from "typeorm";
import { ItemEntity } from "./item.entity";

@Entity('bags')
export class BagEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  userId!: string;

  @ManyToOne(() => ItemEntity, { nullable: false })
  item!: ItemEntity;

  @RelationId((bag: BagEntity) => bag.item)
  itemId!: string;
}
