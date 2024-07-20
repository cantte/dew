DO $$ BEGIN
 CREATE TYPE "public"."sale_status" AS ENUM('pending', 'paid', 'cancelled');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "sale" ADD COLUMN "status" "sale_status" DEFAULT 'pending' NOT NULL;