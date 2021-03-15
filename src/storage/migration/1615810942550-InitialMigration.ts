import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1615810942550 implements MigrationInterface {
    name = 'InitialMigration1615810942550';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "items" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "bags" ("id" varchar PRIMARY KEY NOT NULL, "user_id" varchar NOT NULL, "item_id" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" varchar PRIMARY KEY NOT NULL, "user_id" varchar NOT NULL, "creation_date" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "orders_items" ("id" varchar PRIMARY KEY NOT NULL, "order_id" varchar NOT NULL, "item_id" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "temporary_bags" ("id" varchar PRIMARY KEY NOT NULL, "user_id" varchar NOT NULL, "item_id" varchar NOT NULL, CONSTRAINT "FK_f24fd664a328e1b04e5089b3963" FOREIGN KEY ("item_id") REFERENCES "items" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_bags"("id", "user_id", "item_id") SELECT "id", "user_id", "item_id" FROM "bags"`);
        await queryRunner.query(`DROP TABLE "bags"`);
        await queryRunner.query(`ALTER TABLE "temporary_bags" RENAME TO "bags"`);
        await queryRunner.query(`CREATE TABLE "temporary_orders_items" ("id" varchar PRIMARY KEY NOT NULL, "order_id" varchar NOT NULL, "item_id" varchar NOT NULL, CONSTRAINT "FK_53c21b56c3eebe5cd88525ccd6e" FOREIGN KEY ("order_id") REFERENCES "orders" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_68e3cca1c18928dc1116b4d79bc" FOREIGN KEY ("item_id") REFERENCES "items" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_orders_items"("id", "order_id", "item_id") SELECT "id", "order_id", "item_id" FROM "orders_items"`);
        await queryRunner.query(`DROP TABLE "orders_items"`);
        await queryRunner.query(`ALTER TABLE "temporary_orders_items" RENAME TO "orders_items"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders_items" RENAME TO "temporary_orders_items"`);
        await queryRunner.query(`CREATE TABLE "orders_items" ("id" varchar PRIMARY KEY NOT NULL, "order_id" varchar NOT NULL, "item_id" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "orders_items"("id", "order_id", "item_id") SELECT "id", "order_id", "item_id" FROM "temporary_orders_items"`);
        await queryRunner.query(`DROP TABLE "temporary_orders_items"`);
        await queryRunner.query(`ALTER TABLE "bags" RENAME TO "temporary_bags"`);
        await queryRunner.query(`CREATE TABLE "bags" ("id" varchar PRIMARY KEY NOT NULL, "user_id" varchar NOT NULL, "item_id" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "bags"("id", "user_id", "item_id") SELECT "id", "user_id", "item_id" FROM "temporary_bags"`);
        await queryRunner.query(`DROP TABLE "temporary_bags"`);
        await queryRunner.query(`DROP TABLE "orders_items"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TABLE "bags"`);
        await queryRunner.query(`DROP TABLE "items"`);
    }
}
