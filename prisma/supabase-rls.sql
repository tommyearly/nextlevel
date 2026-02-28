-- Run in Supabase → SQL Editor to fix "RLS Disabled in Public" warnings.
-- Enables RLS and allows your app (Prisma, using the DB role from DATABASE_URL) full access.
-- PostgREST/anon key will have no access (no policies for anon), which is correct for app-only tables.
-- If your DATABASE_URL uses a different role than postgres (e.g. pooler), replace "postgres" in TO postgres with that role.

-- Lead
ALTER TABLE "Lead" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow app full access" ON "Lead"
  FOR ALL TO postgres USING (true) WITH CHECK (true);

-- TicketMessage
ALTER TABLE "TicketMessage" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow app full access" ON "TicketMessage"
  FOR ALL TO postgres USING (true) WITH CHECK (true);

-- MagicLinkToken
ALTER TABLE "MagicLinkToken" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow app full access" ON "MagicLinkToken"
  FOR ALL TO postgres USING (true) WITH CHECK (true);

-- ProcessedStripeSession
ALTER TABLE "ProcessedStripeSession" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow app full access" ON "ProcessedStripeSession"
  FOR ALL TO postgres USING (true) WITH CHECK (true);

-- EmailSubscriber
ALTER TABLE "EmailSubscriber" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow app full access" ON "EmailSubscriber"
  FOR ALL TO postgres USING (true) WITH CHECK (true);
