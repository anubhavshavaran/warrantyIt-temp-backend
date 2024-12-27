/*
  Warnings:

  - You are about to drop the column `BUYER_EMAIL_ID` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `BUYER_FIRST_NAME` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `BUYER_ID` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `BUYER_LAST_NAME` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `BUYER_PHONE_NUMBER` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `PRODUCT_PURCHASE_DATE` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `PRODUCT_SERIAL_NUMBER` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `PRODUCT_BILL_IMAGE_URL` on the `Vendor` table. All the data in the column will be lost.
  - Added the required column `VENDOR_DETAILS` to the `Vendor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `VENDOR_GSTIN` to the `Vendor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_BUYER_ID_fkey";

-- DropForeignKey
ALTER TABLE "Vendor" DROP CONSTRAINT "Vendor_BUYER_ID_fkey";

-- DropIndex
DROP INDEX "Product_PRODUCT_SERIAL_NUMBER_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "BUYER_EMAIL_ID",
DROP COLUMN "BUYER_FIRST_NAME",
DROP COLUMN "BUYER_ID",
DROP COLUMN "BUYER_LAST_NAME",
DROP COLUMN "BUYER_PHONE_NUMBER",
DROP COLUMN "PRODUCT_PURCHASE_DATE",
DROP COLUMN "PRODUCT_SERIAL_NUMBER";

-- AlterTable
ALTER TABLE "Vendor" DROP COLUMN "PRODUCT_BILL_IMAGE_URL",
ADD COLUMN     "VENDOR_DETAILS" TEXT NOT NULL,
ADD COLUMN     "VENDOR_GSTIN" TEXT NOT NULL;
