import { Migration } from '@mikro-orm/migrations';

export class Migration20250809162637 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "pokemon_type" add column "imported_from_id" varchar(255) null;`);
    this.addSql(`alter table "pokemon_type" add constraint "pokemon_type_imported_from_id_foreign" foreign key ("imported_from_id") references "file_import" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "pokemon" add column "imported_from_id" varchar(255) null;`);
    this.addSql(`alter table "pokemon" add constraint "pokemon_imported_from_id_foreign" foreign key ("imported_from_id") references "file_import" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "pokemon_type_link" add column "imported_from_id" varchar(255) null;`);
    this.addSql(`alter table "pokemon_type_link" add constraint "pokemon_type_link_imported_from_id_foreign" foreign key ("imported_from_id") references "file_import" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "pokemon" drop constraint "pokemon_imported_from_id_foreign";`);

    this.addSql(`alter table "pokemon_type" drop constraint "pokemon_type_imported_from_id_foreign";`);

    this.addSql(`alter table "pokemon_type_link" drop constraint "pokemon_type_link_imported_from_id_foreign";`);

    this.addSql(`alter table "pokemon" drop column "imported_from_id";`);

    this.addSql(`alter table "pokemon_type" drop column "imported_from_id";`);

    this.addSql(`alter table "pokemon_type_link" drop column "imported_from_id";`);
  }

}
