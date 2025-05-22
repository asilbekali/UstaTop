/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `master` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "product" ALTER COLUMN "isActive" SET DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "master_email_key" ON "master"("email");
