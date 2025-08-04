ALTER TABLE "Company" ADD COLUMN "updatedAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN "updatedAt" TIMESTAMP(3);

-- Atualize os registros existentes
UPDATE "Company" SET "updatedAt" = NOW();
UPDATE "User" SET "updatedAt" = NOW();

-- Torne as colunas obrigatórias
ALTER TABLE "Company" ALTER COLUMN "updatedAt" SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN "updatedAt" SET NOT NULL;
