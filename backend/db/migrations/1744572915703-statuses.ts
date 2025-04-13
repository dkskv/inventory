import { MigrationInterface, QueryRunner } from "typeorm";

export class Statuses1744572915703 implements MigrationInterface {
    name = 'Statuses1744572915703'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "status" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "color" character varying(7) NOT NULL, CONSTRAINT "UQ_95ff138b88fdd8a7c9ebdb97a32" UNIQUE ("name"), CONSTRAINT "PK_e12743a7086ec826733f54e1d95" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "inventory_record_statuses_status" ("inventoryRecordId" integer NOT NULL, "statusId" integer NOT NULL, CONSTRAINT "PK_8a5801869daf983a2cc3381c0a2" PRIMARY KEY ("inventoryRecordId", "statusId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fe5f732ea8e8aa23aef6f7cc3e" ON "inventory_record_statuses_status" ("inventoryRecordId") `);
        await queryRunner.query(`CREATE INDEX "IDX_2e6cdc96e57bbf25bcbbc351aa" ON "inventory_record_statuses_status" ("statusId") `);
        await queryRunner.query(`ALTER TABLE "inventory_record_statuses_status" ADD CONSTRAINT "FK_fe5f732ea8e8aa23aef6f7cc3eb" FOREIGN KEY ("inventoryRecordId") REFERENCES "inventory_record"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "inventory_record_statuses_status" ADD CONSTRAINT "FK_2e6cdc96e57bbf25bcbbc351aa3" FOREIGN KEY ("statusId") REFERENCES "status"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_record_statuses_status" DROP CONSTRAINT "FK_2e6cdc96e57bbf25bcbbc351aa3"`);
        await queryRunner.query(`ALTER TABLE "inventory_record_statuses_status" DROP CONSTRAINT "FK_fe5f732ea8e8aa23aef6f7cc3eb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2e6cdc96e57bbf25bcbbc351aa"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fe5f732ea8e8aa23aef6f7cc3e"`);
        await queryRunner.query(`DROP TABLE "inventory_record_statuses_status"`);
        await queryRunner.query(`DROP TABLE "status"`);
    }

}
