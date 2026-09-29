import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260929212326 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "order_enquiry" add column if not exists "packing_fee" real not null default 0, add column if not exists "grand_total" real not null default 0, add column if not exists "tracking_number" text null, add column if not exists "admin_notes" text null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "order_enquiry" drop column if exists "packing_fee", drop column if exists "grand_total", drop column if exists "tracking_number", drop column if exists "admin_notes";`);
  }

}
