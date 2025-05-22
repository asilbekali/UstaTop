/*
  Warnings:

  - You are about to drop the column `exprience` on the `master` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "master" DROP COLUMN "exprience";

-- CreateTable
CREATE TABLE "masterProduct" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "minWorkHour" INTEGER NOT NULL,
    "levelId" INTEGER NOT NULL,
    "priceHour" INTEGER NOT NULL,
    "priceDay" INTEGER NOT NULL,
    "exprience" INTEGER NOT NULL,
    "masterId" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "masterProduct_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "masterProduct" ADD CONSTRAINT "masterProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "masterProduct" ADD CONSTRAINT "masterProduct_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "masterProduct" ADD CONSTRAINT "masterProduct_masterId_fkey" FOREIGN KEY ("masterId") REFERENCES "master"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
