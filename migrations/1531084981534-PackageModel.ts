import { MigrationInterface, QueryRunner } from 'typeorm';

export class PackageModel1531084981534 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "wine_package" ADD "modelId" integer`);
        await queryRunner.query(`ALTER TABLE "wine_package" ADD CONSTRAINT "UQ_8faaadd5168235ade5cbcba6532" UNIQUE ("modelId")`);
        await queryRunner.query(`ALTER TABLE "wine_package" ADD CONSTRAINT "FK_8faaadd5168235ade5cbcba6532" FOREIGN KEY ("modelId") REFERENCES "file"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "wine_package" DROP CONSTRAINT "FK_8faaadd5168235ade5cbcba6532"`);
        await queryRunner.query(`ALTER TABLE "wine_package" DROP CONSTRAINT "UQ_8faaadd5168235ade5cbcba6532"`);
        await queryRunner.query(`ALTER TABLE "wine_package" DROP COLUMN "modelId"`);
    }

}
