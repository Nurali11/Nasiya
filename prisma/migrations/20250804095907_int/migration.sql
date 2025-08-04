/*
  Warnings:

  - Added the required column `monthlySum` to the `Nasiya` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Nasiya" ADD COLUMN     "monthlySum" INTEGER NOT NULL;
