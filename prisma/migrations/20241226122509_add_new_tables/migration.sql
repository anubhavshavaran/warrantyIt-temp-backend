/*
  Warnings:

  - You are about to drop the column `BRAND_WARRANTY` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `PRODUCT_BILL_IMAGE_URL` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `VENDOR_NAME` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `VENDOR_RETURN_POLICY` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `WARRANTY_CARD_IMAGE_URL` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `WARRANTY_COVERAGE` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `WARRANTY_DURATION` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `WARRANTY_TYPE` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `WARRANTY_UNIT` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "BRAND_WARRANTY",
DROP COLUMN "PRODUCT_BILL_IMAGE_URL",
DROP COLUMN "VENDOR_NAME",
DROP COLUMN "VENDOR_RETURN_POLICY",
DROP COLUMN "WARRANTY_CARD_IMAGE_URL",
DROP COLUMN "WARRANTY_COVERAGE",
DROP COLUMN "WARRANTY_DURATION",
DROP COLUMN "WARRANTY_TYPE",
DROP COLUMN "WARRANTY_UNIT";

-- CreateTable
CREATE TABLE "Vendor" (
    "VENDOR_ID" TEXT NOT NULL,
    "BUYER_ID" TEXT NOT NULL,
    "VENDOR_NAME" TEXT NOT NULL,
    "VENDOR_RETURN_POLICY" TEXT NOT NULL,
    "PRODUCT_BILL_IMAGE_URL" TEXT NOT NULL,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("VENDOR_ID")
);

-- CreateTable
CREATE TABLE "Warranty" (
    "WARRANTY_ID" TEXT NOT NULL,
    "WARRANTY_DURATION" TEXT NOT NULL,
    "WARRANTY_UNIT" TEXT NOT NULL,
    "WARRANTY_COVERAGE" TEXT NOT NULL,
    "WARRANTY_TYPE" TEXT NOT NULL,
    "BRAND_WARRANTY" TEXT NOT NULL,
    "WARRANTY_CARD_IMAGE_URL" TEXT NOT NULL,
    "BUYER_ID" TEXT NOT NULL,
    "PRODUCT_ID" TEXT NOT NULL,
    "VENDOR_ID" TEXT NOT NULL,

    CONSTRAINT "Warranty_pkey" PRIMARY KEY ("WARRANTY_ID")
);

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_BUYER_ID_fkey" FOREIGN KEY ("BUYER_ID") REFERENCES "User"("USER_ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warranty" ADD CONSTRAINT "Warranty_BUYER_ID_fkey" FOREIGN KEY ("BUYER_ID") REFERENCES "User"("USER_ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warranty" ADD CONSTRAINT "Warranty_PRODUCT_ID_fkey" FOREIGN KEY ("PRODUCT_ID") REFERENCES "Product"("PRODUCT_ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warranty" ADD CONSTRAINT "Warranty_VENDOR_ID_fkey" FOREIGN KEY ("VENDOR_ID") REFERENCES "Vendor"("VENDOR_ID") ON DELETE CASCADE ON UPDATE CASCADE;
