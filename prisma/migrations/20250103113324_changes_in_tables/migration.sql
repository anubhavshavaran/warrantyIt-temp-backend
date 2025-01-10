/*
  Warnings:

  - You are about to drop the column `VENDOR_DETAILS` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the column `WARRANTY_DURATION` on the `Warranty` table. All the data in the column will be lost.
  - You are about to drop the column `WARRANTY_UNIT` on the `Warranty` table. All the data in the column will be lost.
  - Added the required column `VENDOR_ADDRESS` to the `Vendor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `VENDOR_CONTACT` to the `Vendor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `VENDOR_WARRANTY_COVERAGE` to the `Vendor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `PRODUCT_PURCHASE_DATE` to the `Warranty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `PRODUCT_SERIAL_NUMBER` to the `Warranty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `WARRANTY_END_DATE` to the `Warranty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `WARRANTY_START_DATE` to the `Warranty` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vendor" DROP COLUMN "VENDOR_DETAILS",
ADD COLUMN     "VENDOR_ADDRESS" TEXT NOT NULL,
ADD COLUMN     "VENDOR_CONTACT" TEXT NOT NULL,
ADD COLUMN     "VENDOR_WARRANTY_COVERAGE" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Warranty" DROP COLUMN "WARRANTY_DURATION",
DROP COLUMN "WARRANTY_UNIT",
ADD COLUMN     "PRODUCT_PURCHASE_DATE" TEXT NOT NULL,
ADD COLUMN     "PRODUCT_SERIAL_NUMBER" TEXT NOT NULL,
ADD COLUMN     "WARRANTY_END_DATE" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "WARRANTY_START_DATE" TIMESTAMP(3) NOT NULL;
