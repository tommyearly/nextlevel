-- Run this in Supabase → SQL Editor if "npx prisma db push" fails from your machine.
-- Creates the tables the app needs. Safe to run (uses IF NOT EXISTS).

CREATE TABLE IF NOT EXISTS "Lead" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "company" TEXT,
  "packageId" TEXT NOT NULL,
  "packageLabel" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "stripeCustomerId" TEXT,
  "paymentStatus" TEXT,
  "totalPaidCents" INTEGER NOT NULL DEFAULT 0,
  "projectUrl" TEXT,
  "progressStage" TEXT,
  "progressUpdatedAt" TIMESTAMP(3),
  "customerFeedback" TEXT,
  "customerFeedbackAt" TIMESTAMP(3),
  "packageChangeRequestedAt" TIMESTAMP(3),
  "packageChangeFrom" TEXT,
  "paymentReceipts" JSONB,
  CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "MagicLinkToken" (
  "id" TEXT NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "usedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MagicLinkToken_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "MagicLinkToken_tokenHash_key" ON "MagicLinkToken"("tokenHash");
CREATE INDEX IF NOT EXISTS "MagicLinkToken_expiresAt_idx" ON "MagicLinkToken"("expiresAt");

CREATE TABLE IF NOT EXISTS "TicketMessage" (
  "id" TEXT NOT NULL,
  "leadId" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "fromRole" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TicketMessage_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "TicketMessage" DROP CONSTRAINT IF EXISTS "TicketMessage_leadId_fkey";
ALTER TABLE "TicketMessage" ADD CONSTRAINT "TicketMessage_leadId_fkey"
  FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX IF NOT EXISTS "TicketMessage_leadId_idx" ON "TicketMessage"("leadId");

CREATE INDEX IF NOT EXISTS "Lead_email_createdAt_idx" ON "Lead"("email", "createdAt" DESC);

CREATE TABLE IF NOT EXISTS "ProcessedStripeSession" (
  "sessionId" TEXT NOT NULL,
  "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProcessedStripeSession_pkey" PRIMARY KEY ("sessionId")
);

CREATE TABLE IF NOT EXISTS "EmailSubscriber" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "name" TEXT,
  "source" TEXT,
  "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "unsubscribedAt" TIMESTAMP(3),
  CONSTRAINT "EmailSubscriber_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "EmailSubscriber_email_key" ON "EmailSubscriber"("email");
CREATE INDEX IF NOT EXISTS "EmailSubscriber_status_idx" ON "EmailSubscriber"("status");
CREATE INDEX IF NOT EXISTS "EmailSubscriber_email_idx" ON "EmailSubscriber"("email");

-- If Lead table already existed before these columns were added, run once in SQL Editor:
-- ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "totalPaidCents" INTEGER NOT NULL DEFAULT 0;
-- ALTER TABLE "Lead" ADD COLUMN IF NOT EXISTS "paymentReceipts" JSONB;
-- CREATE INDEX IF NOT EXISTS "Lead_email_createdAt_idx" ON "Lead"("email", "createdAt" DESC);
