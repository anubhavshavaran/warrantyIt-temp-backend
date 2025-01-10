/*
  Warnings:

  - You are about to drop the column `FIRST_NAME` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `LAST_NAME` on the `User` table. All the data in the column will be lost.
  - Added the required column `NAME` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "FIRST_NAME",
DROP COLUMN "LAST_NAME",
ADD COLUMN     "NAME" TEXT NOT NULL,
ALTER COLUMN "ADDRESS" DROP NOT NULL,
ALTER COLUMN "PHONE_NUMBER" DROP NOT NULL;
