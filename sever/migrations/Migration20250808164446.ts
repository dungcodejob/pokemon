import { Migration } from '@mikro-orm/migrations';

export class Migration20250808164446 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user" add column "delete_flag" boolean not null, add column "deleted_at" timestamptz null;`);

    this.addSql(`alter table "account" add column "delete_flag" boolean not null, add column "deleted_at" timestamptz null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user" drop column "delete_flag", drop column "deleted_at";`);

    this.addSql(`alter table "account" drop column "delete_flag", drop column "deleted_at";`);
  }

}
