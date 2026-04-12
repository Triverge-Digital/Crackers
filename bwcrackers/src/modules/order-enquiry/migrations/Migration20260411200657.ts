import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260411200657 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "order_enquiry" ("id" text not null, "customer_name" text not null, "phone" text not null, "email" text null, "address" text null, "city" text null, "state" text null, "pincode" text null, "notes" text null, "items" jsonb not null, "subtotal" real not null, "currency_code" text not null default 'inr', "status" text not null default 'pending', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "order_enquiry_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_order_enquiry_deleted_at" ON "order_enquiry" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "order_enquiry" cascade;`);
  }

}
