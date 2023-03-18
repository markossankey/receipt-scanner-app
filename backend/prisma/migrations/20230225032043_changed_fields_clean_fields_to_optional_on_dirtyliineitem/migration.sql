-- DropForeignKey
ALTER TABLE "DirtyLineItem" DROP CONSTRAINT "DirtyLineItem_cleanReceiptId_fkey";

-- DropForeignKey
ALTER TABLE "DirtyLineItem" DROP CONSTRAINT "DirtyLineItem_cleanedLineItemId_fkey";

-- AlterTable
ALTER TABLE "DirtyLineItem" ALTER COLUMN "cleanedLineItemId" DROP NOT NULL,
ALTER COLUMN "cleanReceiptId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "DirtyLineItem" ADD CONSTRAINT "DirtyLineItem_cleanedLineItemId_fkey" FOREIGN KEY ("cleanedLineItemId") REFERENCES "LineItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirtyLineItem" ADD CONSTRAINT "DirtyLineItem_cleanReceiptId_fkey" FOREIGN KEY ("cleanReceiptId") REFERENCES "Receipt"("id") ON DELETE SET NULL ON UPDATE CASCADE;
