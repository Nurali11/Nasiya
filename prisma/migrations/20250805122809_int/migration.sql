/*
  Warnings:

  - You are about to drop the column `debtId` on the `paymentHistory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_nasiyaId_fkey";

-- AlterTable
ALTER TABLE "paymentHistory" DROP COLUMN "debtId",
ADD COLUMN     "nasiyaId" TEXT;

-- AddForeignKey
ALTER TABLE "paymentHistory" ADD CONSTRAINT "paymentHistory_nasiyaId_fkey" FOREIGN KEY ("nasiyaId") REFERENCES "Nasiya"("id") ON DELETE SET NULL ON UPDATE CASCADE;
