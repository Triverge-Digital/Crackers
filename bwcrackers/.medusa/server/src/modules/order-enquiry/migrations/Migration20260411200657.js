"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20260411200657 = void 0;
const migrations_1 = require("@medusajs/framework/mikro-orm/migrations");
class Migration20260411200657 extends migrations_1.Migration {
    async up() {
        this.addSql(`create table if not exists "order_enquiry" ("id" text not null, "customer_name" text not null, "phone" text not null, "email" text null, "address" text null, "city" text null, "state" text null, "pincode" text null, "notes" text null, "items" jsonb not null, "subtotal" real not null, "currency_code" text not null default 'inr', "status" text not null default 'pending', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "order_enquiry_pkey" primary key ("id"));`);
        this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_order_enquiry_deleted_at" ON "order_enquiry" ("deleted_at") WHERE deleted_at IS NULL;`);
    }
    async down() {
        this.addSql(`drop table if exists "order_enquiry" cascade;`);
    }
}
exports.Migration20260411200657 = Migration20260411200657;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlncmF0aW9uMjAyNjA0MTEyMDA2NTcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9vcmRlci1lbnF1aXJ5L21pZ3JhdGlvbnMvTWlncmF0aW9uMjAyNjA0MTEyMDA2NTcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseUVBQXFFO0FBRXJFLE1BQWEsdUJBQXdCLFNBQVEsc0JBQVM7SUFFM0MsS0FBSyxDQUFDLEVBQUU7UUFDZixJQUFJLENBQUMsTUFBTSxDQUFDLDJpQkFBMmlCLENBQUMsQ0FBQztRQUN6akIsSUFBSSxDQUFDLE1BQU0sQ0FBQyx1SEFBdUgsQ0FBQyxDQUFDO0lBQ3ZJLENBQUM7SUFFUSxLQUFLLENBQUMsSUFBSTtRQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLCtDQUErQyxDQUFDLENBQUM7SUFDL0QsQ0FBQztDQUVGO0FBWEQsMERBV0MifQ==