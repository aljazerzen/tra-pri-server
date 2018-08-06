import {MigrationInterface, QueryRunner} from "typeorm";

export class SyncMigrations1533579890426 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "UQ_8faaadd5168235ade5cbcba6532"`);
        await queryRunner.query(`CREATE INDEX "IDX_8faaadd5168235ade5cbcba653" ON "wine_package"("modelId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_8faaadd5168235ade5cbcba653"`);
        await queryRunner.query(`CREATE INDEX "UQ_8faaadd5168235ade5cbcba6532" ON "wine_package"("modelId") `);
    }

}
