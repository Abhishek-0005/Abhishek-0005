-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INCOME', 'EXPENSE');

-- CreateTable Category
CREATE TABLE "Category" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE,
  "description" TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- CreateTable Transaction
CREATE TABLE "Transaction" (
  "id" SERIAL PRIMARY KEY,
  "date" TIMESTAMP NOT NULL DEFAULT NOW(),
  "amount" DECIMAL(12,2) NOT NULL,
  "type" "TransactionType" NOT NULL,
  "description" TEXT,
  "categoryId" INTEGER,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT "Transaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Indexes
CREATE INDEX "Transaction_date_idx" ON "Transaction" ("date");
CREATE INDEX "Transaction_categoryId_idx" ON "Transaction" ("categoryId");
CREATE INDEX "Transaction_type_idx" ON "Transaction" ("type");
