/*
  Warnings:

  - You are about to drop the column `priceDay` on the `master` table. All the data in the column will be lost.
  - You are about to drop the column `priceHour` on the `master` table. All the data in the column will be lost.
  - You are about to drop the `_MasterLevel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MasterTools` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProLevel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProTools` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_MasterLevel" DROP CONSTRAINT "_MasterLevel_A_fkey";

-- DropForeignKey
ALTER TABLE "_MasterLevel" DROP CONSTRAINT "_MasterLevel_B_fkey";

-- DropForeignKey
ALTER TABLE "_MasterTools" DROP CONSTRAINT "_MasterTools_A_fkey";

-- DropForeignKey
ALTER TABLE "_MasterTools" DROP CONSTRAINT "_MasterTools_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProLevel" DROP CONSTRAINT "_ProLevel_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProLevel" DROP CONSTRAINT "_ProLevel_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProTools" DROP CONSTRAINT "_ProTools_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProTools" DROP CONSTRAINT "_ProTools_B_fkey";

-- AlterTable
ALTER TABLE "master" DROP COLUMN "priceDay",
DROP COLUMN "priceHour";

-- AlterTable
ALTER TABLE "product" ADD COLUMN     "avatars" TEXT NOT NULL DEFAULT '';

-- DropTable
DROP TABLE "_MasterLevel";

-- DropTable
DROP TABLE "_MasterTools";

-- DropTable
DROP TABLE "_ProLevel";

-- DropTable
DROP TABLE "_ProTools";

-- CreateTable
CREATE TABLE "productLevel" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "levelId" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "productLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productTools" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "toolsId" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "productTools_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "productLevel" ADD CONSTRAINT "productLevel_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productLevel" ADD CONSTRAINT "productLevel_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productTools" ADD CONSTRAINT "productTools_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productTools" ADD CONSTRAINT "productTools_toolsId_fkey" FOREIGN KEY ("toolsId") REFERENCES "tools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
