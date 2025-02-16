/*
  Warnings:

  - Added the required column `USER_ID` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "USER_ID" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_USER_ID_fkey" FOREIGN KEY ("USER_ID") REFERENCES "User"("USER_ID") ON DELETE CASCADE ON UPDATE CASCADE;
