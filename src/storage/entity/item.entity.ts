import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('items')
export class ItemEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;
}
