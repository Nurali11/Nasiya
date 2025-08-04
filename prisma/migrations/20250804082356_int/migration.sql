/*
  Warnings:

  - You are about to drop the column `sellerId` on the `DebtorPhone` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `Seller` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phone` to the `Seller` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."DebtorPhone" DROP CONSTRAINT "DebtorPhone_sellerId_fkey";

-- AlterTable
ALTER TABLE "public"."DebtorPhone" DROP COLUMN "sellerId",
ADD COLUMN     "debtorId" TEXT;

-- AlterTable
ALTER TABLE "public"."Seller" ADD COLUMN     "phone" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Seller_phone_key" ON "public"."Seller"("phone");

-- AddForeignKey
ALTER TABLE "public"."DebtorPhone" ADD CONSTRAINT "DebtorPhone_debtorId_fkey" FOREIGN KEY ("debtorId") REFERENCES "public"."Debtor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
