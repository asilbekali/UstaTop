-- DropForeignKey
ALTER TABLE "order_iteam" DROP CONSTRAINT "order_iteam_backetId_fkey";

-- AddForeignKey
ALTER TABLE "order_iteam" ADD CONSTRAINT "order_iteam_backetId_fkey" FOREIGN KEY ("backetId") REFERENCES "backet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
