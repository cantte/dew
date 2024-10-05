ALTER TABLE "employee" DROP CONSTRAINT "employee_email_phone_code_unique";--> statement-breakpoint
ALTER TABLE "employee" ADD CONSTRAINT "employee_code_unique" UNIQUE("code");--> statement-breakpoint
ALTER TABLE "employee" ADD CONSTRAINT "employee_email_unique" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "employee" ADD CONSTRAINT "employee_phone_unique" UNIQUE("phone");