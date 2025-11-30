CREATE TABLE "ideas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ideas" ADD CONSTRAINT "ideas_owner_users_id_fk" FOREIGN KEY ("owner") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;