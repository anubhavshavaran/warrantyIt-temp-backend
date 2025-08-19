/*
  Warnings:

  - Added the required column `VENDOR_ID` to the `Warranty` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ClaimStatus" AS ENUM ('SUBMITTED', 'IN_REVIEW', 'TECHNICIAN_ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Claim" ADD COLUMN     "CURRENT_STATUS" "ClaimStatus" NOT NULL DEFAULT 'SUBMITTED';

-- AlterTable
ALTER TABLE "Warranty" ADD COLUMN     "VENDOR_ID" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ClaimStatusHistory" (
    "HISTORY_ID" TEXT NOT NULL,
    "CLAIM_ID" TEXT NOT NULL,
    "STATUS" "ClaimStatus" NOT NULL,
    "UPDATED_AT" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClaimStatusHistory_pkey" PRIMARY KEY ("HISTORY_ID")
);

-- AddForeignKey
ALTER TABLE "Warranty" ADD CONSTRAINT "Warranty_VENDOR_ID_fkey" FOREIGN KEY ("VENDOR_ID") REFERENCES "Vendor"("VENDOR_ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClaimStatusHistory" ADD CONSTRAINT "ClaimStatusHistory_CLAIM_ID_fkey" FOREIGN KEY ("CLAIM_ID") REFERENCES "Claim"("CLAIM_ID") ON DELETE CASCADE ON UPDATE CASCADE;
