-- DropForeignKey
ALTER TABLE "orderIteamTools" DROP CONSTRAINT "orderIteamTools_order_iteamId_fkey";

-- AddForeignKey
ALTER TABLE "orderIteamTools" ADD CONSTRAINT "orderIteamTools_order_iteamId_fkey" FOREIGN KEY ("order_iteamId") REFERENCES "order_iteam"("id") ON DELETE CASCADE ON UPDATE CASCADE;
