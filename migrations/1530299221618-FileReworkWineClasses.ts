import { MigrationInterface, QueryRunner } from 'typeorm';

export class fileReworkWineClasses1530299221618 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "file" RENAME COLUMN "key" TO "path"`);
        await queryRunner.query(`ALTER TABLE "wine" ADD "classNumber" integer NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "wine" DROP COLUMN "classNumber"`);
        await queryRunner.query(`ALTER TABLE "file" RENAME COLUMN "path" TO "key"`);
    }

}
