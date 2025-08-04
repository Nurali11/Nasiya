/*
  Warnings:

  - You are about to drop the column `pinKod` on the `Seller` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Seller" DROP COLUMN "pinKod",
ALTER COLUMN "balance" SET DEFAULT 0;
