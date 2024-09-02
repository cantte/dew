CREATE TABLE IF NOT EXISTS "user_payment" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"customer_id" text,
	"card_token" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_payment" ADD CONSTRAINT "user_payment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
