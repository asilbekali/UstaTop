/*
  Warnings:

  - You are about to drop the column `order_iteamId` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `order_iteam` table. All the data in the column will be lost.
  - Added the required column `order_Id` to the `backet` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "order_iteam" DROP CONSTRAINT "order_iteam_orderId_fkey";

-- AlterTable
ALTER TABLE "backet" ADD COLUMN     "order_Id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "order" DROP COLUMN "order_iteamId";

-- AlterTable
ALTER TABLE "order_iteam" DROP COLUMN "orderId";

-- AddForeignKey
ALTER TABLE "order_iteam" ADD CONSTRAINT "order_iteam_backetId_fkey" FOREIGN KEY ("backetId") REFERENCES "backet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
