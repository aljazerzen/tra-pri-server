import {MigrationInterface, QueryRunner} from "typeorm";

export class WineTypeImage1535358843533 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "wine_type" ADD "imageId" integer`);
        await queryRunner.query(`ALTER TABLE "wine_type" ADD CONSTRAINT "UQ_be0d77998c49e694cc9839b6676" UNIQUE ("imageId")`);
        await queryRunner.query(`ALTER TABLE "wine_type" ADD CONSTRAINT "FK_be0d77998c49e694cc9839b6676" FOREIGN KEY ("imageId") REFERENCES "file"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "wine_type" DROP CONSTRAINT "FK_be0d77998c49e694cc9839b6676"`);
        await queryRunner.query(`ALTER TABLE "wine_type" DROP CONSTRAINT "UQ_be0d77998c49e694cc9839b6676"`);
        await queryRunner.query(`ALTER TABLE "wine_type" DROP COLUMN "imageId"`);
    }

}
