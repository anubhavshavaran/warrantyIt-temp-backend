/*
  Warnings:

  - The `IS_PRODUCT_OWNED` column on the `Warranty` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Warranty" ADD COLUMN     "SHOW" BOOLEAN,
DROP COLUMN "IS_PRODUCT_OWNED",
ADD COLUMN     "IS_PRODUCT_OWNED" BOOLEAN;
