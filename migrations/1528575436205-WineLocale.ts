import {MigrationInterface, QueryRunner} from "typeorm";

export class wineLocale1528575436205 implements MigrationInterface {

    public async up(qr: QueryRunner): Promise<any> {
        await qr.query(`ALTER TABLE "wine" ADD "culinarySl" text NOT NULL DEFAULT ''`);
        await qr.query(`UPDATE "wine" SET "culinarySl"="culinary"`);
        await qr.query(`ALTER TABLE "wine" ADD "culinaryEn" text NOT NULL DEFAULT ''`);

        await qr.query(`ALTER TABLE "wine" ADD "temperatureSl" text NOT NULL DEFAULT ''`);
        await qr.query(`UPDATE "wine" SET "temperatureSl"="temperature"`);
        await qr.query(`ALTER TABLE "wine" ADD "temperatureEn" text NOT NULL DEFAULT ''`);

        await qr.query(`ALTER TABLE "wine" ADD "featuresSl" text NOT NULL DEFAULT ''`);
        await qr.query(`UPDATE "wine" SET "featuresSl"="features"`);
        await qr.query(`ALTER TABLE "wine" ADD "featuresEn" text NOT NULL DEFAULT ''`);

        await qr.query(`ALTER TABLE "wine" ADD "awardsSl" text NOT NULL DEFAULT ''`);
        await qr.query(`UPDATE "wine" SET "awardsSl"="awards"`);
        await qr.query(`ALTER TABLE "wine" ADD "awardsEn" text NOT NULL DEFAULT ''`);

        await qr.query(`ALTER TABLE "wine" DROP COLUMN "culinary"`);
        await qr.query(`ALTER TABLE "wine" DROP COLUMN "temperature"`);
        await qr.query(`ALTER TABLE "wine" DROP COLUMN "features"`);
        await qr.query(`ALTER TABLE "wine" DROP COLUMN "awards"`);
    }

    public async down(qr: QueryRunner): Promise<any> {
        await qr.query(`ALTER TABLE "wine" ADD "awards" text NOT NULL DEFAULT ''`);
        await qr.query(`UPDATE "wine" SET "awards"="awardsSl"`);
        
        await qr.query(`ALTER TABLE "wine" ADD "features" text NOT NULL DEFAULT ''`);
        await qr.query(`UPDATE "wine" SET "features"="featuresSl"`);
        
        await qr.query(`ALTER TABLE "wine" ADD "temperature" text NOT NULL DEFAULT ''`);
        await qr.query(`UPDATE "wine" SET "temperature"="temperatureSl"`);
        
        await qr.query(`ALTER TABLE "wine" ADD "culinary" text NOT NULL DEFAULT ''`);
        await qr.query(`UPDATE "wine" SET "culinary"="culinarySl"`);
        
        await qr.query(`ALTER TABLE "wine" DROP COLUMN "awardsEn"`);
        await qr.query(`ALTER TABLE "wine" DROP COLUMN "awardsSl"`);
        await qr.query(`ALTER TABLE "wine" DROP COLUMN "featuresEn"`);
        await qr.query(`ALTER TABLE "wine" DROP COLUMN "featuresSl"`);
        await qr.query(`ALTER TABLE "wine" DROP COLUMN "temperatureEn"`);
        await qr.query(`ALTER TABLE "wine" DROP COLUMN "temperatureSl"`);
        await qr.query(`ALTER TABLE "wine" DROP COLUMN "culinaryEn"`);
        await qr.query(`ALTER TABLE "wine" DROP COLUMN "culinarySl"`);
    }

}
