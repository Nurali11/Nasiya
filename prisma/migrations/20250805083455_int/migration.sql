-- DropIndex
DROP INDEX "DebtorPhone_phone_key";

-- CreateTable
CREATE TABLE "PaymentPeriod" (
    "id" TEXT NOT NULL,
    "period" INTEGER NOT NULL,
    "sum" INTEGER NOT NULL,
    "nasiyaId" TEXT,

    CONSTRAINT "PaymentPeriod_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PaymentPeriod" ADD CONSTRAINT "PaymentPeriod_nasiyaId_fkey" FOREIGN KEY ("nasiyaId") REFERENCES "Nasiya"("id") ON DELETE SET NULL ON UPDATE CASCADE;
