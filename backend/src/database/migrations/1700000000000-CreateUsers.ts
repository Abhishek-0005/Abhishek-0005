import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsers1700000000000 implements MigrationInterface {
    name = 'CreateUsers1700000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS citext');

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "users" (
              "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
              "email" citext NOT NULL UNIQUE,
              "password" text NOT NULL,
              "name" character varying NULL,
              "roles" character varying[] NOT NULL DEFAULT '{}',
              "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
              "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
            )
        `);

        await queryRunner.query(`
          CREATE UNIQUE INDEX IF NOT EXISTS "uq_users_email" ON "users" ("email")
        `);

        await queryRunner.query(`
          CREATE OR REPLACE FUNCTION update_updated_at_column()
          RETURNS TRIGGER AS $$
          BEGIN
            NEW."updatedAt" = now();
            RETURN NEW;
          END;
          $$ language 'plpgsql';
        `);

        await queryRunner.query(`
          DROP TRIGGER IF EXISTS set_timestamp ON "users";
        `);
        await queryRunner.query(`
          CREATE TRIGGER set_timestamp
          BEFORE UPDATE ON "users"
          FOR EACH ROW
          EXECUTE PROCEDURE update_updated_at_column();
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TRIGGER IF EXISTS set_timestamp ON "users"');
        await queryRunner.query('DROP FUNCTION IF EXISTS update_updated_at_column');
        await queryRunner.query('DROP TABLE IF EXISTS "users"');
    }
}
