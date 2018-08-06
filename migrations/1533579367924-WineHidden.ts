import { MigrationInterface, QueryRunner } from 'typeorm';

export class WineHidden1533579367924 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "wine" ADD "hidden" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "wine" DROP COLUMN "hidden"`);
    }

}
