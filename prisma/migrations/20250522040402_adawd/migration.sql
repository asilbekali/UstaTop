/*
  Warnings:

  - You are about to drop the column `minWorkHour` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `priceDay` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `priceHour` on the `product` table. All the data in the column will be lost.
  - Added the required column `minWorkHour` to the `productLevel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceDay` to the `productLevel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceHour` to the `productLevel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product" DROP COLUMN "minWorkHour",
DROP COLUMN "priceDay",
DROP COLUMN "priceHour";

-- AlterTable
ALTER TABLE "productLevel" ADD COLUMN     "minWorkHour" INTEGER NOT NULL,
ADD COLUMN     "priceDay" INTEGER NOT NULL,
ADD COLUMN     "priceHour" INTEGER NOT NULL;
