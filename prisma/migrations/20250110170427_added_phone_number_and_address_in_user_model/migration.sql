/*
  Warnings:

  - Added the required column `ADDRESS` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `PHONE_NUMBER` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_PASSWORD_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "ADDRESS" TEXT NOT NULL,
ADD COLUMN     "PHONE_NUMBER" TEXT NOT NULL;
