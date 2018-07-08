import {MigrationInterface, QueryRunner} from "typeorm";

export class WineTemperature1531038003831 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "wine" DROP COLUMN "temperatureSl"`);
        await queryRunner.query(`ALTER TABLE "wine" DROP COLUMN "temperatureEn"`);
        await queryRunner.query(`ALTER TABLE "wine" ADD "temperatureFrom" float`);
        await queryRunner.query(`ALTER TABLE "wine" ADD "temperatureTo" float`);
        await queryRunner.query(`ALTER TABLE "file" ALTER COLUMN "url" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "file" ALTER COLUMN "url" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "wine" DROP COLUMN "temperatureTo"`);
        await queryRunner.query(`ALTER TABLE "wine" DROP COLUMN "temperatureFrom"`);
        await queryRunner.query(`ALTER TABLE "wine" ADD "temperatureEn" text NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "wine" ADD "temperatureSl" text NOT NULL DEFAULT ''`);
    }

}
