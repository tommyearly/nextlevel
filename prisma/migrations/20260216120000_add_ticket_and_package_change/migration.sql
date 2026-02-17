-- AlterTable
ALTER TABLE "Lead" ADD COLUMN "packageChangeRequestedAt" DATETIME;
ALTER TABLE "Lead" ADD COLUMN "packageChangeFrom" TEXT;

-- CreateTable
CREATE TABLE "TicketMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "leadId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "fromRole" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "TicketMessage_leadId_idx" ON "TicketMessage"("leadId");
