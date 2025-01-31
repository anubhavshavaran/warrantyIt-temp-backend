/*
  Warnings:

  - You are about to drop the column `VENDOR_WARRANTY_COVERAGE` on the `Vendor` table. All the data in the column will be lost.
  - Added the required column `VENDOR_WARRANTY_COVERAGE` to the `Warranty` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vendor" DROP COLUMN "VENDOR_WARRANTY_COVERAGE";

-- AlterTable
ALTER TABLE "Warranty" ADD COLUMN     "VENDOR_WARRANTY_COVERAGE" TEXT NOT NULL;
