-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('yuridik', 'fizichski');

-- CreateEnum
CREATE TYPE "measuer" AS ENUM ('day', 'hour');

-- CreateEnum
CREATE TYPE "status" AS ENUM ('active', 'pending', 'rejected', 'payed');

-- CreateEnum
CREATE TYPE "role" AS ENUM ('admin', 'super_admin', 'viwer_admin', 'user_fiz', 'user_yur');

-- CreateTable
CREATE TABLE "region" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "type" "UserType" NOT NULL,
    "bank" TEXT,
    "address" TEXT,
    "okend" TEXT,
    "inn" TEXT,
    "pc" TEXT,
    "mfo" TEXT,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "regionId" INTEGER NOT NULL,
    "role" "role" NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "level" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "level_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brend" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "brend_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "size" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "size_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tools" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,
    "code" SERIAL NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "capasityId" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sizeId" INTEGER NOT NULL,
    "brendId" INTEGER NOT NULL,

    CONSTRAINT "tools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "capasity" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "capasity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "image" TEXT NOT NULL,
    "minWorkHour" INTEGER NOT NULL,
    "priceHour" INTEGER NOT NULL,
    "priceDay" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "master" (
    "id" SERIAL NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "year" INTEGER NOT NULL,
    "priceHour" INTEGER NOT NULL,
    "priceDay" INTEGER NOT NULL,
    "exprience" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "image" TEXT NOT NULL,
    "passpoerImage" TEXT NOT NULL,
    "star" INTEGER NOT NULL,
    "about" TEXT NOT NULL,

    CONSTRAINT "master_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "stars" INTEGER NOT NULL,
    "masterId" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_iteam" (
    "id" SERIAL NOT NULL,
    "count" INTEGER NOT NULL,
    "measuer" "measuer" NOT NULL,
    "total" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "pymentType" TEXT NOT NULL,
    "withDeliver" BOOLEAN NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productId" INTEGER NOT NULL,
    "levelId" INTEGER NOT NULL,
    "toolsId" INTEGER NOT NULL,
    "backetId" INTEGER NOT NULL,
    "orderId" INTEGER NOT NULL,

    CONSTRAINT "order_iteam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order" (
    "id" SERIAL NOT NULL,
    "order_iteamId" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "backet" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "backet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_check_order" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "status" "status" NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_check_order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "my_sessions" (
    "id" SERIAL NOT NULL,
    "deviceName" TEXT NOT NULL,
    "deviceIP" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "my_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "showCase" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "link" TEXT NOT NULL,

    CONSTRAINT "showCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "general" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "links" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "addminsTg" TEXT NOT NULL,

    CONSTRAINT "general_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sugesstion" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "suerName" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "sugesstion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partners" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faq" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,

    CONSTRAINT "faq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProLevel" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProLevel_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ProTools" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProTools_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_MasterTools" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MasterTools_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_MasterLevel" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MasterLevel_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "tools_code_key" ON "tools"("code");

-- CreateIndex
CREATE INDEX "_ProLevel_B_index" ON "_ProLevel"("B");

-- CreateIndex
CREATE INDEX "_ProTools_B_index" ON "_ProTools"("B");

-- CreateIndex
CREATE INDEX "_MasterTools_B_index" ON "_MasterTools"("B");

-- CreateIndex
CREATE INDEX "_MasterLevel_B_index" ON "_MasterLevel"("B");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tools" ADD CONSTRAINT "tools_capasityId_fkey" FOREIGN KEY ("capasityId") REFERENCES "capasity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tools" ADD CONSTRAINT "tools_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "size"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tools" ADD CONSTRAINT "tools_brendId_fkey" FOREIGN KEY ("brendId") REFERENCES "brend"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_iteam" ADD CONSTRAINT "order_iteam_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_iteam" ADD CONSTRAINT "order_iteam_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_iteam" ADD CONSTRAINT "order_iteam_toolsId_fkey" FOREIGN KEY ("toolsId") REFERENCES "tools"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_iteam" ADD CONSTRAINT "order_iteam_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "backet" ADD CONSTRAINT "backet_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_check_order" ADD CONSTRAINT "admin_check_order_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProLevel" ADD CONSTRAINT "_ProLevel_A_fkey" FOREIGN KEY ("A") REFERENCES "level"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProLevel" ADD CONSTRAINT "_ProLevel_B_fkey" FOREIGN KEY ("B") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProTools" ADD CONSTRAINT "_ProTools_A_fkey" FOREIGN KEY ("A") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProTools" ADD CONSTRAINT "_ProTools_B_fkey" FOREIGN KEY ("B") REFERENCES "tools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MasterTools" ADD CONSTRAINT "_MasterTools_A_fkey" FOREIGN KEY ("A") REFERENCES "master"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MasterTools" ADD CONSTRAINT "_MasterTools_B_fkey" FOREIGN KEY ("B") REFERENCES "tools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MasterLevel" ADD CONSTRAINT "_MasterLevel_A_fkey" FOREIGN KEY ("A") REFERENCES "master"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MasterLevel" ADD CONSTRAINT "_MasterLevel_B_fkey" FOREIGN KEY ("B") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
