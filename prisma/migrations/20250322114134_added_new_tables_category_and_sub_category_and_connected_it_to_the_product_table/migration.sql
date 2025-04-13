/*
  Warnings:

  - Added the required column `CATEGORY_ID` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `SUB_CATEGORY_ID` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "CATEGORY_ID" TEXT NOT NULL,
ADD COLUMN     "SUB_CATEGORY_ID" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Category" (
    "CATEGORY_ID" TEXT NOT NULL,
    "CATEGORY" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("CATEGORY_ID")
);

-- CreateTable
CREATE TABLE "SubCategory" (
    "SUB_CATEGORY_ID" TEXT NOT NULL,
    "SUB_CATEGORY" TEXT NOT NULL,
    "CATEGORY_ID" TEXT NOT NULL,

    CONSTRAINT "SubCategory_pkey" PRIMARY KEY ("SUB_CATEGORY_ID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_CATEGORY_key" ON "Category"("CATEGORY");

-- CreateIndex
CREATE UNIQUE INDEX "SubCategory_SUB_CATEGORY_key" ON "SubCategory"("SUB_CATEGORY");

-- AddForeignKey
ALTER TABLE "SubCategory" ADD CONSTRAINT "SubCategory_CATEGORY_ID_fkey" FOREIGN KEY ("CATEGORY_ID") REFERENCES "Category"("CATEGORY_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_CATEGORY_ID_fkey" FOREIGN KEY ("CATEGORY_ID") REFERENCES "Category"("CATEGORY_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_SUB_CATEGORY_ID_fkey" FOREIGN KEY ("SUB_CATEGORY_ID") REFERENCES "SubCategory"("SUB_CATEGORY_ID") ON DELETE RESTRICT ON UPDATE CASCADE;
