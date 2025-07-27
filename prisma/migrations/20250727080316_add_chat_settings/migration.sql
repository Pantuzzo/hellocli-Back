-- CreateTable
CREATE TABLE "ChatSettings" (
    "id" SERIAL NOT NULL,
    "companyId" INTEGER NOT NULL,
    "welcomeMsg" TEXT NOT NULL DEFAULT 'Olá! Como posso te ajudar?',
    "fallbackMsg" TEXT NOT NULL DEFAULT 'Desculpe, não entendi. Pode reformular?',
    "useHuman" BOOLEAN NOT NULL DEFAULT false,
    "handoffAfter" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChatSettings_companyId_key" ON "ChatSettings"("companyId");

-- AddForeignKey
ALTER TABLE "ChatSettings" ADD CONSTRAINT "ChatSettings_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
