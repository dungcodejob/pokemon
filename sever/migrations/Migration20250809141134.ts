import { Migration } from '@mikro-orm/migrations';

export class Migration20250809141134 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "pokemon" ("id" varchar(255) not null, "name" varchar(255) not null, "total" int not null, "hp" int not null, "attack" int not null, "defense" int not null, "sp_attack" int not null, "sp_defense" int not null, "speed" int not null, "generation" int not null, "legendary" boolean not null, "image" varchar(255) null, "ytb_url" varchar(255) null, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null, "delete_flag" boolean not null, "deleted_at" timestamptz null, constraint "pokemon_pkey" primary key ("id"));`);

    this.addSql(`create table "pokemon_type" ("id" varchar(255) not null, "name" varchar(255) not null, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null, "delete_flag" boolean not null, "deleted_at" timestamptz null, constraint "pokemon_type_pkey" primary key ("id"));`);

    this.addSql(`create table "pokemon_type_link" ("id" serial primary key, "pokemon_id" varchar(255) not null, "type_id" varchar(255) not null, "is_primary" boolean not null, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null, "delete_flag" boolean not null default false, "deleted_at" timestamptz null);`);

    this.addSql(`alter table "pokemon_type_link" add constraint "pokemon_type_link_pokemon_id_foreign" foreign key ("pokemon_id") references "pokemon" ("id") on update cascade;`);
    this.addSql(`alter table "pokemon_type_link" add constraint "pokemon_type_link_type_id_foreign" foreign key ("type_id") references "pokemon_type" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "pokemon_type_link" drop constraint "pokemon_type_link_pokemon_id_foreign";`);

    this.addSql(`alter table "pokemon_type_link" drop constraint "pokemon_type_link_type_id_foreign";`);

    this.addSql(`drop table if exists "pokemon" cascade;`);

    this.addSql(`drop table if exists "pokemon_type" cascade;`);

    this.addSql(`drop table if exists "pokemon_type_link" cascade;`);
  }

}
