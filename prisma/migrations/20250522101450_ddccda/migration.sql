/*
  Warnings:

  - Added the required column `user_Id` to the `order_iteam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order_iteam" ADD COLUMN     "user_Id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "backetId" INTEGER;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_backetId_fkey" FOREIGN KEY ("backetId") REFERENCES "backet"("id") ON DELETE SET NULL ON UPDATE CASCADE;
