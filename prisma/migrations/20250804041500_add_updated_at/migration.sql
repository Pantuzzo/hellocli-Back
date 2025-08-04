/*
  Warnings:

  - Made the column `handoffAfter` on table `ChatSettings` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."ChatSettings" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "welcomeMsg" SET DEFAULT 'Olá, como posso te ajudar?',
ALTER COLUMN "handoffAfter" SET NOT NULL,
ALTER COLUMN "handoffAfter" SET DEFAULT 3;

-- CreateIndex
CREATE INDEX "Conversation_userId_idx" ON "public"."Conversation"("userId");

-- CreateIndex
CREATE INDEX "Conversation_companyId_idx" ON "public"."Conversation"("companyId");

-- CreateIndex
CREATE INDEX "Message_conversationId_idx" ON "public"."Message"("conversationId");
