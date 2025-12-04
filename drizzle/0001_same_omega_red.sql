CREATE TABLE "favorites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "favorites" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "generated_names" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"name" text NOT NULL,
	"rationale" text,
	"domain_status" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "generated_names" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "naming_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"criteria" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "naming_sessions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name_id" uuid NOT NULL,
	"product_type" text NOT NULL,
	"polar_order_id" text,
	"status" text NOT NULL,
	"amount_cents" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orders_polar_order_id_unique" UNIQUE("polar_order_id")
);
--> statement-breakpoint
ALTER TABLE "orders" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"pdf_url" text,
	"generated_at" timestamp,
	CONSTRAINT "reports_order_id_unique" UNIQUE("order_id")
);
--> statement-breakpoint
ALTER TABLE "reports" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "risk_checks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name_id" uuid NOT NULL,
	"status" text NOT NULL,
	"factors" jsonb NOT NULL,
	"checked_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "risk_checks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"segment" text,
	"first_run_completed" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "user_profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "ideas" CASCADE;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_name_id_generated_names_id_fk" FOREIGN KEY ("name_id") REFERENCES "public"."generated_names"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generated_names" ADD CONSTRAINT "generated_names_session_id_naming_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."naming_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "naming_sessions" ADD CONSTRAINT "naming_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_name_id_generated_names_id_fk" FOREIGN KEY ("name_id") REFERENCES "public"."generated_names"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "risk_checks" ADD CONSTRAINT "risk_checks_name_id_generated_names_id_fk" FOREIGN KEY ("name_id") REFERENCES "public"."generated_names"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "favorites_user_id_idx" ON "favorites" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "favorites_user_id_name_id_idx" ON "favorites" USING btree ("user_id","name_id");--> statement-breakpoint
CREATE INDEX "generated_names_session_id_idx" ON "generated_names" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "naming_sessions_user_id_idx" ON "naming_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "orders_user_id_idx" ON "orders" USING btree ("user_id");--> statement-breakpoint
CREATE POLICY "favorites_crud_own" ON "favorites" AS PERMISSIVE FOR ALL TO "authenticated" USING ("favorites"."user_id" = (select auth.uid())) WITH CHECK ("favorites"."user_id" = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "generated_names_select_via_session" ON "generated_names" AS PERMISSIVE FOR SELECT TO "authenticated" USING (EXISTS (
        SELECT 1 FROM naming_sessions 
        WHERE naming_sessions.id = "generated_names"."session_id" 
        AND naming_sessions.user_id = (select auth.uid())
      ));--> statement-breakpoint
CREATE POLICY "generated_names_insert_via_session" ON "generated_names" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (EXISTS (
        SELECT 1 FROM naming_sessions 
        WHERE naming_sessions.id = "generated_names"."session_id" 
        AND naming_sessions.user_id = (select auth.uid())
      ));--> statement-breakpoint
CREATE POLICY "naming_sessions_crud_own" ON "naming_sessions" AS PERMISSIVE FOR ALL TO "authenticated" USING ("naming_sessions"."user_id" = (select auth.uid())) WITH CHECK ("naming_sessions"."user_id" = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "orders_select_own" ON "orders" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("orders"."user_id" = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "orders_insert_own" ON "orders" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ("orders"."user_id" = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "reports_select_via_order" ON "reports" AS PERMISSIVE FOR SELECT TO "authenticated" USING (EXISTS (
        SELECT 1 FROM orders 
        WHERE orders.id = "reports"."order_id" 
        AND orders.user_id = (select auth.uid())
      ));--> statement-breakpoint
CREATE POLICY "risk_checks_select_via_name" ON "risk_checks" AS PERMISSIVE FOR SELECT TO "authenticated" USING (EXISTS (
        SELECT 1 FROM generated_names gn
        JOIN naming_sessions ns ON ns.id = gn.session_id
        WHERE gn.id = "risk_checks"."name_id"
        AND ns.user_id = (select auth.uid())
      ));--> statement-breakpoint
CREATE POLICY "user_profiles_select_own" ON "user_profiles" AS PERMISSIVE FOR SELECT TO "authenticated" USING ("user_profiles"."user_id" = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "user_profiles_insert_own" ON "user_profiles" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ("user_profiles"."user_id" = (select auth.uid()));--> statement-breakpoint
CREATE POLICY "user_profiles_update_own" ON "user_profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ("user_profiles"."user_id" = (select auth.uid())) WITH CHECK ("user_profiles"."user_id" = (select auth.uid()));