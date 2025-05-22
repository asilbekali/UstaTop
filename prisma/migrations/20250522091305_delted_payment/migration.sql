-- DropForeignKey
ALTER TABLE "order_iteam" DROP CONSTRAINT "order_iteam_toolsId_fkey";

-- CreateTable
CREATE TABLE "orderIteamTools" (
    "id" SERIAL NOT NULL,
    "toolsId" INTEGER NOT NULL,
    "order_iteamId" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orderIteamTools_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "orderIteamTools" ADD CONSTRAINT "orderIteamTools_toolsId_fkey" FOREIGN KEY ("toolsId") REFERENCES "tools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orderIteamTools" ADD CONSTRAINT "orderIteamTools_order_iteamId_fkey" FOREIGN KEY ("order_iteamId") REFERENCES "order_iteam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
