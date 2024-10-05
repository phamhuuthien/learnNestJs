import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateBookTable1728100959200 implements MigrationInterface {
    name = 'UpdateBookTable1728100959200'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" ADD "category" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "book" ADD CONSTRAINT "UQ_94ce5afb055926a2569c8e5b838" UNIQUE ("category")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" DROP CONSTRAINT "UQ_94ce5afb055926a2569c8e5b838"`);
        await queryRunner.query(`ALTER TABLE "book" DROP COLUMN "category"`);
    }

}
