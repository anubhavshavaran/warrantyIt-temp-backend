/*
  Warnings:

  - You are about to drop the column `PRODUCT_ID` on the `Claim` table. All the data in the column will be lost.
  - Added the required column `BUYER_ID` to the `Claim` table without a default value. This is not possible if the table is not empty.
  - Added the required column `WARRANTY_ID` to the `Claim` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Claim" DROP CONSTRAINT "Claim_PRODUCT_ID_fkey";

-- AlterTable
ALTER TABLE "Claim" DROP COLUMN "PRODUCT_ID",
ADD COLUMN     "BUYER_ID" TEXT NOT NULL,
ADD COLUMN     "WARRANTY_ID" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_BUYER_ID_fkey" FOREIGN KEY ("BUYER_ID") REFERENCES "User"("USER_ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_WARRANTY_ID_fkey" FOREIGN KEY ("WARRANTY_ID") REFERENCES "Warranty"("WARRANTY_ID") ON DELETE CASCADE ON UPDATE CASCADE;
