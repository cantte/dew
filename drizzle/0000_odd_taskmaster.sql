DO $$ BEGIN
 CREATE TYPE "public"."payment_method" AS ENUM('cash', 'creditCard', 'debitCard', 'transfer');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."order_status" AS ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account" (
	"userId" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"providerAccountId" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"sessionToken" varchar(255) PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_preference" (
	"user_id" varchar(255) PRIMARY KEY NOT NULL,
	"store_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"emailVerified" timestamp DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verificationToken" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cash_register_transaction" (
	"id" uuid PRIMARY KEY NOT NULL,
	"amount" real NOT NULL,
	"type" varchar(32) NOT NULL,
	"cash_register_id" uuid NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cash_register" (
	"id" uuid PRIMARY KEY NOT NULL,
	"amount" real NOT NULL,
	"store_id" uuid NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "customer" (
	"id" varchar(32) PRIMARY KEY NOT NULL,
	"name" varchar(128) NOT NULL,
	"email" varchar(255),
	"phone" varchar(32),
	"created_by" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "employee_store" (
	"employee_id" uuid NOT NULL,
	"store_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "employee_store_store_id_employee_id_role_id_pk" PRIMARY KEY("store_id","employee_id","role_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "employee" (
	"id" uuid PRIMARY KEY NOT NULL,
	"code" varchar(32),
	"name" varchar(128) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(32),
	"user_id" varchar(255),
	"created_by" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "employee_email_phone_code_unique" UNIQUE("email","phone","code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "inventory" (
	"store_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"stock" integer NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"low_stock_notification_sended" boolean,
	CONSTRAINT "inventory_store_id_product_id_pk" PRIMARY KEY("store_id","product_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "menu_item" (
	"id" uuid PRIMARY KEY NOT NULL,
	"parent_id" uuid,
	"title" varchar(255) NOT NULL,
	"href" varchar(255),
	"icon" varchar(30),
	"priority" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "role_menu_item" (
	"role_id" uuid NOT NULL,
	"menu_item_id" uuid NOT NULL,
	CONSTRAINT "role_menu_item_role_id_menu_item_id_pk" PRIMARY KEY("role_id","menu_item_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_history" (
	"id" uuid PRIMARY KEY NOT NULL,
	"order_id" uuid NOT NULL,
	"status" "order_status" NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_item" (
	"id" uuid PRIMARY KEY NOT NULL,
	"order_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"purchase_price" real NOT NULL,
	"sale_price" real NOT NULL,
	"profit" real NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order_summary" (
	"id" uuid PRIMARY KEY NOT NULL,
	"date" date DEFAULT CURRENT_DATE NOT NULL,
	"amount" real NOT NULL,
	"profit" real NOT NULL,
	"orders" integer NOT NULL,
	"customers" integer NOT NULL,
	"products" integer NOT NULL,
	"store_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "order_summary_date_store_id_unique" UNIQUE("date","store_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "order" (
	"id" uuid PRIMARY KEY NOT NULL,
	"customer_id" varchar(32) NOT NULL,
	"store_id" uuid NOT NULL,
	"amount" real NOT NULL,
	"payment_method" "payment_method" DEFAULT 'cash' NOT NULL,
	"payment" real NOT NULL,
	"status" "order_status" DEFAULT 'pending' NOT NULL,
	"address" text,
	"phone" varchar(32),
	"created_by" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_summary" (
	"id" uuid PRIMARY KEY NOT NULL,
	"product_id" uuid NOT NULL,
	"sales" integer NOT NULL,
	"amount" real NOT NULL,
	"profit" real NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "product_summary_product_id_idx" UNIQUE("product_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product" (
	"id" uuid PRIMARY KEY NOT NULL,
	"code" varchar(255) NOT NULL,
	"name" varchar(255),
	"description" text,
	"purchase_price" real NOT NULL,
	"sale_price" real NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product_discount" (
	"id" uuid PRIMARY KEY NOT NULL,
	"product_id" uuid NOT NULL,
	"is_percentage" boolean NOT NULL,
	"discount" real NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "permission" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "role_permission" (
	"role_id" uuid NOT NULL,
	"permission_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "role_permission_role_id_permission_id_pk" PRIMARY KEY("role_id","permission_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "role" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sale_item" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"sale_code" varchar(36) NOT NULL,
	"product_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"purchase_price" real NOT NULL,
	"sale_price" real NOT NULL,
	"profit" real NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sale_summary" (
	"id" uuid PRIMARY KEY NOT NULL,
	"date" date DEFAULT CURRENT_DATE NOT NULL,
	"amount" real NOT NULL,
	"profit" real NOT NULL,
	"sales" integer NOT NULL,
	"customers" integer NOT NULL,
	"products" integer NOT NULL,
	"store_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "sale_summary_date_store_id_unique" UNIQUE("date","store_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sale" (
	"code" varchar(36) PRIMARY KEY NOT NULL,
	"customer_id" varchar(32) NOT NULL,
	"amount" real NOT NULL,
	"payment_method" "payment_method" DEFAULT 'cash' NOT NULL,
	"payment" real NOT NULL,
	"store_id" uuid NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "store" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(128) NOT NULL,
	"address" text,
	"phone" varchar(32),
	"nit" varchar(32),
	"created_by" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_preference" ADD CONSTRAINT "user_preference_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_preference" ADD CONSTRAINT "user_preference_store_id_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."store"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cash_register_transaction" ADD CONSTRAINT "cash_register_transaction_cash_register_id_cash_register_id_fk" FOREIGN KEY ("cash_register_id") REFERENCES "public"."cash_register"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cash_register_transaction" ADD CONSTRAINT "cash_register_transaction_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cash_register" ADD CONSTRAINT "cash_register_store_id_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."store"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cash_register" ADD CONSTRAINT "cash_register_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "customer" ADD CONSTRAINT "customer_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "employee_store" ADD CONSTRAINT "employee_store_employee_id_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "employee_store" ADD CONSTRAINT "employee_store_store_id_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."store"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "employee_store" ADD CONSTRAINT "employee_store_role_id_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."role"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "employee" ADD CONSTRAINT "employee_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "employee" ADD CONSTRAINT "employee_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inventory" ADD CONSTRAINT "inventory_store_id_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."store"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inventory" ADD CONSTRAINT "inventory_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "menu_item" ADD CONSTRAINT "menu_item_parent_id_menu_item_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."menu_item"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "role_menu_item" ADD CONSTRAINT "role_menu_item_role_id_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."role"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "role_menu_item" ADD CONSTRAINT "role_menu_item_menu_item_id_menu_item_id_fk" FOREIGN KEY ("menu_item_id") REFERENCES "public"."menu_item"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_history" ADD CONSTRAINT "order_history_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_item" ADD CONSTRAINT "order_item_order_id_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_item" ADD CONSTRAINT "order_item_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_item" ADD CONSTRAINT "order_item_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order_summary" ADD CONSTRAINT "order_summary_store_id_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."store"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order" ADD CONSTRAINT "order_customer_id_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order" ADD CONSTRAINT "order_store_id_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."store"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "order" ADD CONSTRAINT "order_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_summary" ADD CONSTRAINT "product_summary_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product" ADD CONSTRAINT "product_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_discount" ADD CONSTRAINT "product_discount_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "product_discount" ADD CONSTRAINT "product_discount_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_role_id_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."role"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_permission_id_permission_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permission"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sale_item" ADD CONSTRAINT "sale_item_sale_code_sale_code_fk" FOREIGN KEY ("sale_code") REFERENCES "public"."sale"("code") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sale_item" ADD CONSTRAINT "sale_item_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sale_item" ADD CONSTRAINT "sale_item_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sale_summary" ADD CONSTRAINT "sale_summary_store_id_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."store"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sale" ADD CONSTRAINT "sale_customer_id_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sale" ADD CONSTRAINT "sale_store_id_store_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."store"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sale" ADD CONSTRAINT "sale_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "store" ADD CONSTRAINT "store_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_userId_idx" ON "account" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_userId_idx" ON "session" USING btree ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cash_register_transaction_cash_register_id_idx" ON "cash_register_transaction" USING btree ("cash_register_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "created_by_idx" ON "cash_register_transaction" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cash_register_store_id_idx" ON "cash_register" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cash_register_created_by_idx" ON "cash_register" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "customer_created_by_idx" ON "customer" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "menu_item_parent_id_idx" ON "menu_item" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "role_menu_item_role_id_idx" ON "role_menu_item" USING btree ("role_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "role_menu_item_menu_item_id_idx" ON "role_menu_item" USING btree ("menu_item_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_history_order_id_idx" ON "order_history" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_history_created_by_idx" ON "order_history" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_item_order_id_idx" ON "order_item" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_item_product_id_idx" ON "order_item" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_item_created_by_idx" ON "order_item" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_summary_store_id_idx" ON "order_summary" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_customer_id_idx" ON "order" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_store_id_idx" ON "order" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "order_created_by_idx" ON "order" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_created_by_idx" ON "product" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "product_discount_product_id_idx" ON "product_discount" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sale_item_sale_code_idx" ON "sale_item" USING btree ("sale_code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sale_item_product_id_idx" ON "sale_item" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sale_item_created_by_idx" ON "sale_item" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sale_summary_store_id_idx" ON "sale_summary" USING btree ("store_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sale_customer_id_idx" ON "sale" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "sale_created_by_idx" ON "sale" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "store_created_by_idx" ON "store" USING btree ("created_by");