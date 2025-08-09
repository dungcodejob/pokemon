import { Migration } from '@mikro-orm/migrations';

export class Migration20250809154536 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "pokemon" alter column "delete_flag" type boolean using ("delete_flag"::boolean);`);
    this.addSql(`alter table "pokemon" alter column "delete_flag" set default false;`);

    this.addSql(`alter table "pokemon_type" alter column "delete_flag" type boolean using ("delete_flag"::boolean);`);
    this.addSql(`alter table "pokemon_type" alter column "delete_flag" set default false;`);

    this.addSql(`alter table "user" alter column "delete_flag" type boolean using ("delete_flag"::boolean);`);
    this.addSql(`alter table "user" alter column "delete_flag" set default false;`);

    this.addSql(`alter table "account" alter column "delete_flag" type boolean using ("delete_flag"::boolean);`);
    this.addSql(`alter table "account" alter column "delete_flag" set default false;`);

    this.addSql(`alter table "file_import" alter column "delete_flag" type boolean using ("delete_flag"::boolean);`);
    this.addSql(`alter table "file_import" alter column "delete_flag" set default false;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "pokemon" alter column "delete_flag" drop default;`);
    this.addSql(`alter table "pokemon" alter column "delete_flag" type boolean using ("delete_flag"::boolean);`);

    this.addSql(`alter table "pokemon_type" alter column "delete_flag" drop default;`);
    this.addSql(`alter table "pokemon_type" alter column "delete_flag" type boolean using ("delete_flag"::boolean);`);

    this.addSql(`alter table "user" alter column "delete_flag" drop default;`);
    this.addSql(`alter table "user" alter column "delete_flag" type boolean using ("delete_flag"::boolean);`);

    this.addSql(`alter table "account" alter column "delete_flag" drop default;`);
    this.addSql(`alter table "account" alter column "delete_flag" type boolean using ("delete_flag"::boolean);`);

    this.addSql(`alter table "file_import" alter column "delete_flag" drop default;`);
    this.addSql(`alter table "file_import" alter column "delete_flag" type boolean using ("delete_flag"::boolean);`);
  }

}
