import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity('orders')
export class OrderEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  userId!: string;

  @CreateDateColumn()
  creationDate!: Date;
}
