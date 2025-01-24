/*
  Warnings:

  - Added the required column `BUYERS_EMAIL` to the `Warranty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `BUYERS_NAME` to the `Warranty` table without a default value. This is not possible if the table is not empty.
  - Added the required column `BUYERS_PHONE` to the `Warranty` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Warranty" ADD COLUMN     "BUYERS_EMAIL" TEXT NOT NULL,
ADD COLUMN     "BUYERS_NAME" TEXT NOT NULL,
ADD COLUMN     "BUYERS_PHONE" TEXT NOT NULL;
