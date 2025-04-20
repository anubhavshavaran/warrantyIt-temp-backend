/*
  Warnings:

  - You are about to drop the column `PRODUCT_BRAND` on the `Product` table. All the data in the column will be lost.
  - Added the required column `BRAND_ID` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "PRODUCT_BRAND",
ADD COLUMN     "BRAND_ID" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Brand" (
    "BRAND_ID" TEXT NOT NULL,
    "BRAND_NAME" TEXT NOT NULL,
    "CATEGORY_ID" TEXT NOT NULL,
    "SUB_CATEGORY_ID" TEXT NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("BRAND_ID")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_BRAND_ID_fkey" FOREIGN KEY ("BRAND_ID") REFERENCES "Brand"("BRAND_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Brand" ADD CONSTRAINT "Brand_CATEGORY_ID_fkey" FOREIGN KEY ("CATEGORY_ID") REFERENCES "Category"("CATEGORY_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Brand" ADD CONSTRAINT "Brand_SUB_CATEGORY_ID_fkey" FOREIGN KEY ("SUB_CATEGORY_ID") REFERENCES "SubCategory"("SUB_CATEGORY_ID") ON DELETE RESTRICT ON UPDATE CASCADE;
