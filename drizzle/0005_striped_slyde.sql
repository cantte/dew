DO $$ BEGIN
 CREATE TYPE "public"."cash_register_transaction_type" AS ENUM('in', 'out');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "cash_register_transaction" ALTER COLUMN "type" SET DATA TYPE cash_register_transaction_type USING "type"::text::cash_register_transaction_type;