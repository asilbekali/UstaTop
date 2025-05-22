-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_backetId_fkey";

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_backetId_fkey" FOREIGN KEY ("backetId") REFERENCES "backet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
