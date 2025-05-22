/*
  Warnings:

  - You are about to drop the column `order_Id` on the `backet` table. All the data in the column will be lost.
  - You are about to drop the column `backetId` on the `user` table. All the data in the column will be lost.
  - Added the required column `userId` to the `backet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_backetId_fkey";

-- AlterTable
ALTER TABLE "backet" DROP COLUMN "order_Id",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "order" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "backetId";

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "backet" ADD CONSTRAINT "backet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
