-- CreateTable
CREATE TABLE "public"."paymentHistory" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "debtorId" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "debtId" TEXT NOT NULL,

    CONSTRAINT "paymentHistory_pkey" PRIMARY KEY ("id")
);
