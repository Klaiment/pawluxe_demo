import {MigrationInterface, QueryRunner} from "typeorm";

export class AddRate1749055243611 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "collection" ADD "customFieldsPopularityscore" integer DEFAULT '0'`, undefined);
        await queryRunner.query(`ALTER TABLE "product" ADD "customFieldsPopularityscore" integer DEFAULT '0'`, undefined);
   }

   public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "customFieldsPopularityscore"`, undefined);
        await queryRunner.query(`ALTER TABLE "collection" DROP COLUMN "customFieldsPopularityscore"`, undefined);
   }

}
