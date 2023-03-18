/*
  Warnings:

  - You are about to drop the column `randomNumber` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "randomNumber";

-- CreateTable
CREATE TABLE "Receipt" (
    "id" TEXT NOT NULL,
    "total" INTEGER NOT NULL,
    "tax" INTEGER NOT NULL,
    "amountPaid" INTEGER NOT NULL,
    "discountTotal" INTEGER NOT NULL DEFAULT 0,
    "vendorName" TEXT NOT NULL,
    "street" TEXT,
    "city" TEXT,
    "state" TEXT,
    "vendorReceiptId" TEXT,

    CONSTRAINT "Receipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LineItem" (
    "id" TEXT NOT NULL,
    "receiptId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',

    CONSTRAINT "LineItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DirtyLineItem" (
    "id" TEXT NOT NULL,
    "cleanedLineItemId" TEXT NOT NULL,
    "cleanReceiptId" TEXT NOT NULL,
    "dirtyReceiptId" TEXT NOT NULL,
    "name" TEXT,
    "unitPrice" INTEGER,
    "totalPrice" INTEGER,
    "quantity" INTEGER DEFAULT 1,
    "venderCode" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'usd',

    CONSTRAINT "DirtyLineItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DirtyReceipt" (
    "id" TEXT NOT NULL,
    "total" INTEGER,
    "tax" INTEGER,
    "amountPaid" INTEGER,
    "discountTotal" INTEGER NOT NULL DEFAULT 0,
    "vendorName" TEXT,
    "street" TEXT,
    "city" TEXT,
    "state" TEXT,
    "vendorReceiptId" TEXT,

    CONSTRAINT "DirtyReceipt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DirtyLineItem_cleanedLineItemId_key" ON "DirtyLineItem"("cleanedLineItemId");

-- AddForeignKey
ALTER TABLE "LineItem" ADD CONSTRAINT "LineItem_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "Receipt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirtyLineItem" ADD CONSTRAINT "DirtyLineItem_cleanedLineItemId_fkey" FOREIGN KEY ("cleanedLineItemId") REFERENCES "LineItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirtyLineItem" ADD CONSTRAINT "DirtyLineItem_cleanReceiptId_fkey" FOREIGN KEY ("cleanReceiptId") REFERENCES "Receipt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirtyLineItem" ADD CONSTRAINT "DirtyLineItem_dirtyReceiptId_fkey" FOREIGN KEY ("dirtyReceiptId") REFERENCES "DirtyReceipt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
