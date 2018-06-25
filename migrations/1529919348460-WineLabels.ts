import {MigrationInterface, QueryRunner} from "typeorm";

export class wineLabels1529919348460 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "label" ("index" integer NOT NULL, "wineId" integer NOT NULL, "imageId" integer NOT NULL, "coordinates" integer array, CONSTRAINT "PK_e82bd63ceb923d716043251a654" PRIMARY KEY ("index", "wineId", "imageId"))`);
        await queryRunner.query(`ALTER TABLE "label" ADD CONSTRAINT "FK_dd0bea1ebb07b0d249666f678ab" FOREIGN KEY ("wineId") REFERENCES "wine"("id")`);
        await queryRunner.query(`ALTER TABLE "label" ADD CONSTRAINT "FK_1191e0f44b29cde3a642446f415" FOREIGN KEY ("imageId") REFERENCES "file"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "label" DROP CONSTRAINT "FK_1191e0f44b29cde3a642446f415"`);
        await queryRunner.query(`ALTER TABLE "label" DROP CONSTRAINT "FK_dd0bea1ebb07b0d249666f678ab"`);
        await queryRunner.query(`DROP TABLE "label"`);
    }

}
