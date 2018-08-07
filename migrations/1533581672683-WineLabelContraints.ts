import {MigrationInterface, QueryRunner} from "typeorm";

export class WineLabelContraints1533581672683 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "label" DROP CONSTRAINT "FK_dd0bea1ebb07b0d249666f678ab"`);
        await queryRunner.query(`ALTER TABLE "label" ADD CONSTRAINT "FK_dd0bea1ebb07b0d249666f678ab" FOREIGN KEY ("wineId") REFERENCES "wine"("id") ON DELETE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "label" DROP CONSTRAINT "FK_dd0bea1ebb07b0d249666f678ab"`);
        await queryRunner.query(`ALTER TABLE "label" ADD CONSTRAINT "FK_dd0bea1ebb07b0d249666f678ab" FOREIGN KEY ("wineId") REFERENCES "wine"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
