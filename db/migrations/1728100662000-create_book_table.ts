import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBookTable1728100662000 implements MigrationInterface {
    name = 'CreateBookTable1728100662000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "book" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "description" character varying(255) NOT NULL, CONSTRAINT "UQ_233978864a48c44d3fcafe01573" UNIQUE ("name"), CONSTRAINT "UQ_034fb78600f8b9f101e69af6a73" UNIQUE ("description"), CONSTRAINT "PK_a3afef72ec8f80e6e5c310b28a4" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "book"`);
    }

}
