import {MigrationInterface, QueryRunner} from "typeorm";

export class locales1528576272366 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "winemaker" ADD "nameSl" character varying(100) NOT NULL DEFAULT ''`);
        await queryRunner.query(`UPDATE "winemaker" SET "nameSl"="name"`);
        await queryRunner.query(`ALTER TABLE "winemaker" ADD "nameEn" character varying(100) NOT NULL DEFAULT ''`);

        await queryRunner.query(`ALTER TABLE "winemaker" ADD "backgroundSl" text NOT NULL DEFAULT ''`);
        await queryRunner.query(`UPDATE "winemaker" SET "backgroundSl"="background"`);
        await queryRunner.query(`ALTER TABLE "winemaker" ADD "backgroundEn" text NOT NULL DEFAULT ''`);

        await queryRunner.query(`ALTER TABLE "wine_type" ADD "nameSl" character varying(100) NOT NULL DEFAULT ''`);
        await queryRunner.query(`UPDATE "wine_type" SET "nameSl"="name"`);
        await queryRunner.query(`ALTER TABLE "wine_type" ADD "nameEn" character varying(100) NOT NULL DEFAULT ''`);

        await queryRunner.query(`ALTER TABLE "sugar" ADD "nameSl" character varying(100) NOT NULL DEFAULT ''`);
        await queryRunner.query(`UPDATE "sugar" SET "nameSl"="name"`);
        await queryRunner.query(`ALTER TABLE "sugar" ADD "nameEn" character varying(100) NOT NULL DEFAULT ''`);

        await queryRunner.query(`ALTER TABLE "variety" ADD "nameSl" character varying(100) NOT NULL DEFAULT ''`);
        await queryRunner.query(`UPDATE "variety" SET "nameSl"="name"`);
        await queryRunner.query(`ALTER TABLE "variety" ADD "nameEn" character varying(100) NOT NULL DEFAULT ''`);

        await queryRunner.query(`ALTER TABLE "variety" ADD "descriptionSl" text NOT NULL DEFAULT ''`);
        await queryRunner.query(`UPDATE "variety" SET "descriptionSl"="description"`);
        await queryRunner.query(`ALTER TABLE "variety" ADD "descriptionEn" text NOT NULL DEFAULT ''`);

        await queryRunner.query(`ALTER TABLE "winemaker" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "winemaker" DROP COLUMN "background"`);
        await queryRunner.query(`ALTER TABLE "wine_type" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "sugar" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "variety" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "variety" DROP COLUMN "description"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "variety" ADD "description" text NOT NULL DEFAULT ''`);
        await queryRunner.query(`UPDATE "variety" SET "description"="descriptionSl"`);
        
        await queryRunner.query(`ALTER TABLE "variety" ADD "name" character varying(100) NOT NULL`);
        await queryRunner.query(`UPDATE "variety" SET "name"="nameSl"`);
        
        await queryRunner.query(`ALTER TABLE "sugar" ADD "name" character varying(100) NOT NULL`);
        await queryRunner.query(`UPDATE "sugar" SET "name"="nameSl"`);
        
        await queryRunner.query(`ALTER TABLE "wine_type" ADD "name" character varying(100) NOT NULL`);
        await queryRunner.query(`UPDATE "wine_type" SET "name"="nameSl"`);
        
        await queryRunner.query(`ALTER TABLE "winemaker" ADD "background" text NOT NULL DEFAULT ''`);
        await queryRunner.query(`UPDATE "winemaker" SET "background"="backgroundSl"`);
        
        await queryRunner.query(`ALTER TABLE "winemaker" ADD "name" character varying(100) NOT NULL`);
        await queryRunner.query(`UPDATE "winemaker" SET "name"="nameSl"`);
        
        await queryRunner.query(`ALTER TABLE "variety" DROP COLUMN "descriptionEn"`);
        await queryRunner.query(`ALTER TABLE "variety" DROP COLUMN "descriptionSl"`);
        await queryRunner.query(`ALTER TABLE "variety" DROP COLUMN "nameEn"`);
        await queryRunner.query(`ALTER TABLE "variety" DROP COLUMN "nameSl"`);
        await queryRunner.query(`ALTER TABLE "sugar" DROP COLUMN "nameEn"`);
        await queryRunner.query(`ALTER TABLE "sugar" DROP COLUMN "nameSl"`);
        await queryRunner.query(`ALTER TABLE "wine_type" DROP COLUMN "nameEn"`);
        await queryRunner.query(`ALTER TABLE "wine_type" DROP COLUMN "nameSl"`);
        await queryRunner.query(`ALTER TABLE "winemaker" DROP COLUMN "backgroundEn"`);
        await queryRunner.query(`ALTER TABLE "winemaker" DROP COLUMN "backgroundSl"`);
        await queryRunner.query(`ALTER TABLE "winemaker" DROP COLUMN "nameEn"`);
        await queryRunner.query(`ALTER TABLE "winemaker" DROP COLUMN "nameSl"`);
    }

}
