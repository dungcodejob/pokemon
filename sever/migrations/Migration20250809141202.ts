import { Migration } from '@mikro-orm/migrations';

export class Migration20250809141202 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "file_import" ("id" varchar(255) not null, "file_name" varchar(255) not null, "original_name" varchar(255) not null, "import_type" text check ("import_type" in ('pokemon')) not null, "file_type" text check ("file_type" in ('csv', 'xlsx')) not null, "status" text check ("status" in ('pending', 'completed', 'failed')) not null, "account_id" varchar(255) null, "total_rows" int not null, "processed_rows" int not null, "success_rows" int not null, "failed_rows" int not null, "completed_at" timestamptz null, "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz not null, "delete_flag" boolean not null, "deleted_at" timestamptz null, constraint "file_import_pkey" primary key ("id"));`);

    this.addSql(`alter table "file_import" add constraint "file_import_account_id_foreign" foreign key ("account_id") references "account" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "file_import" cascade;`);
  }

}
