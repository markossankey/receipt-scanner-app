-- AlterTable
ALTER TABLE "DirtyReceipt" ADD COLUMN     "date" TIMESTAMP(3),
ALTER COLUMN "discountTotal" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Receipt" ADD COLUMN     "date" TIMESTAMP(3);
