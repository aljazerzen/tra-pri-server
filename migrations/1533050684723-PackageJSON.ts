import { MigrationInterface, QueryRunner } from 'typeorm';

export class PackageJSON1533050684723 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "wine_package" ADD "jsonId" integer`);
        await queryRunner.query(`ALTER TABLE "wine_package" ADD CONSTRAINT "UQ_668107a8f5393986ce0ce0aec93" UNIQUE ("jsonId")`);
        await queryRunner.query(`ALTER TABLE "wine_package" ADD CONSTRAINT "FK_668107a8f5393986ce0ce0aec93" FOREIGN KEY ("jsonId") REFERENCES "file"("id")`);
        await queryRunner.query(`ALTER TABLE "wine_package" DROP CONSTRAINT "UQ_8faaadd5168235ade5cbcba6532";`);
        await queryRunner.query(`CREATE INDEX "UQ_8faaadd5168235ade5cbcba6532" ON wine_package ("modelId");`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "wine_package" DROP CONSTRAINT "FK_668107a8f5393986ce0ce0aec93"`);
        await queryRunner.query(`ALTER TABLE "wine_package" DROP CONSTRAINT "UQ_668107a8f5393986ce0ce0aec93"`);
        await queryRunner.query(`ALTER TABLE "wine_package" DROP COLUMN "jsonId"`);
        await queryRunner.query(`DROP INDEX "UQ_8faaadd5168235ade5cbcba6532" RESTRICT;`);
        await queryRunner.query(`ALTER TABLE "wine_package" ADD CONSTRAINT "UQ_8faaadd5168235ade5cbcba6532" UNIQUE ("modelId")`);

    }

}
