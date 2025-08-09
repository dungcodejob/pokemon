import { Migration } from '@mikro-orm/migrations';

export class Migration20250809191917 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "pokemon_favorite" ("id" varchar(255) not null, "user_id" varchar(255) not null, "pokemon_id" varchar(255) not null, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null, "delete_flag" boolean not null default false, "deleted_at" timestamptz null, constraint "pokemon_favorite_pkey" primary key ("id"));`);
    this.addSql(`alter table "pokemon_favorite" add constraint "pokemon_favorite_user_id_pokemon_id_unique" unique ("user_id", "pokemon_id");`);

    this.addSql(`alter table "pokemon_favorite" add constraint "pokemon_favorite_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "pokemon_favorite" add constraint "pokemon_favorite_pokemon_id_foreign" foreign key ("pokemon_id") references "pokemon" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "pokemon_favorite" cascade;`);
  }

}
