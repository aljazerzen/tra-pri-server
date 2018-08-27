import {MigrationInterface, QueryRunner} from "typeorm";

export class PlaceImage1535355841527 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "place" DROP COLUMN "coordinatesLat"`);
        await queryRunner.query(`ALTER TABLE "place" DROP COLUMN "coordinatesLng"`);
        await queryRunner.query(`ALTER TABLE "place" ADD "imageId" integer`);
        await queryRunner.query(`ALTER TABLE "place" ADD CONSTRAINT "UQ_34f50b562fb988d9aa1ca239f40" UNIQUE ("imageId")`);
        await queryRunner.query(`ALTER TABLE "place" ADD CONSTRAINT "FK_34f50b562fb988d9aa1ca239f40" FOREIGN KEY ("imageId") REFERENCES "file"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "place" DROP CONSTRAINT "FK_34f50b562fb988d9aa1ca239f40"`);
        await queryRunner.query(`ALTER TABLE "place" DROP CONSTRAINT "UQ_34f50b562fb988d9aa1ca239f40"`);
        await queryRunner.query(`ALTER TABLE "place" DROP COLUMN "imageId"`);
        await queryRunner.query(`ALTER TABLE "place" ADD "coordinatesLng" double precision`);
        await queryRunner.query(`ALTER TABLE "place" ADD "coordinatesLat" double precision`);
    }

}
