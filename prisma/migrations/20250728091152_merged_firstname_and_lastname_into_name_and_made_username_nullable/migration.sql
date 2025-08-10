/*
  Warnings:

  - You are about to drop the column `FIRSTNAME` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `LASTNAME` on the `User` table. All the data in the column will be lost.
  - Added the required column `NAME` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "FIRSTNAME",
DROP COLUMN "LASTNAME",
ADD COLUMN     "NAME" TEXT NOT NULL,
ALTER COLUMN "USERNAME" DROP NOT NULL;
