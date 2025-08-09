import { Migration } from '@mikro-orm/migrations';

export class Migration20250809181227 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "pokemon_types" ("pokemon_id" varchar(255) not null, "pokemon_type_id" varchar(255) not null, constraint "pokemon_types_pkey" primary key ("pokemon_id", "pokemon_type_id"));`);

    this.addSql(`alter table "pokemon_types" add constraint "pokemon_types_pokemon_id_foreign" foreign key ("pokemon_id") references "pokemon" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "pokemon_types" add constraint "pokemon_types_pokemon_type_id_foreign" foreign key ("pokemon_type_id") references "pokemon_type" ("id") on update cascade on delete cascade;`);

    this.addSql(`drop table if exists "pokemon_type_link" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "pokemon_type_link" ("id" serial primary key, "pokemon_id" varchar(255) not null, "type_id" varchar(255) not null, "imported_from_id" varchar(255) null, "is_primary" boolean not null, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null, "delete_flag" boolean not null default false, "deleted_at" timestamptz null);`);

    this.addSql(`alter table "pokemon_type_link" add constraint "pokemon_type_link_pokemon_id_foreign" foreign key ("pokemon_id") references "pokemon" ("id") on update cascade;`);
    this.addSql(`alter table "pokemon_type_link" add constraint "pokemon_type_link_type_id_foreign" foreign key ("type_id") references "pokemon_type" ("id") on update cascade;`);
    this.addSql(`alter table "pokemon_type_link" add constraint "pokemon_type_link_imported_from_id_foreign" foreign key ("imported_from_id") references "file_import" ("id") on update cascade on delete set null;`);

    this.addSql(`drop table if exists "pokemon_types" cascade;`);
  }

}
