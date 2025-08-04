/*
  Warnings:

  - You are about to drop the column `debtId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `Seller` table. All the data in the column will be lost.
  - Added the required column `remainedSum` to the `Nasiya` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `period` on the `Nasiya` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `periodMonth` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Seller` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('PENDING', 'ACTIVE');

-- CreateEnum
CREATE TYPE "public"."Roles" AS ENUM ('ADMIN', 'SUPER_ADMIN');

-- DropForeignKey
ALTER TABLE "public"."Payment" DROP CONSTRAINT "Payment_debtId_fkey";

-- AlterTable
ALTER TABLE "public"."Admin" ADD COLUMN     "role" "public"."Roles" NOT NULL DEFAULT 'ADMIN';

-- AlterTable
ALTER TABLE "public"."Debtor" ALTER COLUMN "comment" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Nasiya" ADD COLUMN     "remainedSum" INTEGER NOT NULL,
ADD COLUMN     "sellerId" TEXT,
DROP COLUMN "period",
ADD COLUMN     "period" INTEGER NOT NULL,
ALTER COLUMN "comment" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Payment" DROP COLUMN "debtId",
ADD COLUMN     "nasiyaId" TEXT,
ADD COLUMN     "periodMonth" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Seller" DROP COLUMN "verified",
ADD COLUMN     "active" "public"."Status" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "image" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Nasiya" ADD CONSTRAINT "Nasiya_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "public"."Seller"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_nasiyaId_fkey" FOREIGN KEY ("nasiyaId") REFERENCES "public"."Nasiya"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."paymentHistory" ADD CONSTRAINT "paymentHistory_debtorId_fkey" FOREIGN KEY ("debtorId") REFERENCES "public"."Debtor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
