import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialScheme1741533457804 implements MigrationInterface {
    name = 'InitialScheme1741533457804'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "passwordHash" character varying NOT NULL, "accessRole" character varying(255) NOT NULL DEFAULT 'USER', CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "asset" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_119b2d1c1bdccc42057c303c44f" UNIQUE ("name"), CONSTRAINT "PK_1209d107fe21482beaea51b745e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "location" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_f0336eb8ccdf8306e270d400cf0" UNIQUE ("name"), CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "responsible" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_ced9941e24e87756d20de7e86bd" UNIQUE ("name"), CONSTRAINT "PK_17e34c82bd39c71ea31099833ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "inventory_record" ("id" SERIAL NOT NULL, "serialNumber" character varying(255), "description" text, "locationId" integer, "assetId" integer, "responsibleId" integer, CONSTRAINT "PK_1e75edf389be1fe9b1480a48bf3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "inventory_log" ("id" SERIAL NOT NULL, "timestamp" TIMESTAMP(3) WITH TIME ZONE NOT NULL, "action" character varying(255) NOT NULL, "attribute" character varying(255), "prevValue" jsonb, "nextValue" jsonb, "authorId" integer, "inventoryRecordId" integer, CONSTRAINT "PK_92195bfa4eaa5c9e798021900f7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "inventory_record" ADD CONSTRAINT "FK_127130501085bec7aabeb8bdd52" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory_record" ADD CONSTRAINT "FK_e8e65c3f2ef39d1853a0f36798e" FOREIGN KEY ("assetId") REFERENCES "asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory_record" ADD CONSTRAINT "FK_93997e551627fab844c67dfa6bb" FOREIGN KEY ("responsibleId") REFERENCES "responsible"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory_log" ADD CONSTRAINT "FK_5c9142c1fbe9c501bc1a93d0ac5" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory_log" ADD CONSTRAINT "FK_8ef29d4ed91bea8c56bc225a5c0" FOREIGN KEY ("inventoryRecordId") REFERENCES "inventory_record"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_log" DROP CONSTRAINT "FK_8ef29d4ed91bea8c56bc225a5c0"`);
        await queryRunner.query(`ALTER TABLE "inventory_log" DROP CONSTRAINT "FK_5c9142c1fbe9c501bc1a93d0ac5"`);
        await queryRunner.query(`ALTER TABLE "inventory_record" DROP CONSTRAINT "FK_93997e551627fab844c67dfa6bb"`);
        await queryRunner.query(`ALTER TABLE "inventory_record" DROP CONSTRAINT "FK_e8e65c3f2ef39d1853a0f36798e"`);
        await queryRunner.query(`ALTER TABLE "inventory_record" DROP CONSTRAINT "FK_127130501085bec7aabeb8bdd52"`);
        await queryRunner.query(`DROP TABLE "inventory_log"`);
        await queryRunner.query(`DROP TABLE "inventory_record"`);
        await queryRunner.query(`DROP TABLE "responsible"`);
        await queryRunner.query(`DROP TABLE "location"`);
        await queryRunner.query(`DROP TABLE "asset"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
