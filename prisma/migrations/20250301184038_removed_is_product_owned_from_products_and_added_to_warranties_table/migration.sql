/*
  Warnings:

  - You are about to drop the column `IS_PRODUCT_OWNED` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "IS_PRODUCT_OWNED";

-- AlterTable
ALTER TABLE "Warranty" ADD COLUMN     "IS_PRODUCT_OWNED" TEXT;
