CREATE TABLE IF NOT EXISTS "webhook_event" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"processed" boolean DEFAULT false NOT NULL,
	"body" text NOT NULL,
	"error" text,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp
);
