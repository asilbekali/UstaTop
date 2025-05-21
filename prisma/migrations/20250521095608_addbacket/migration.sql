/*
  Warnings:

  - You are about to drop the column `orderId` on the `backet` table. All the data in the column will be lost.
  - Added the required column `backetId` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "backet" DROP CONSTRAINT "backet_orderId_fkey";

-- AlterTable
ALTER TABLE "backet" DROP COLUMN "orderId";

-- AlterTable
ALTER TABLE "order" ADD COLUMN     "backetId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_backetId_fkey" FOREIGN KEY ("backetId") REFERENCES "backet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
