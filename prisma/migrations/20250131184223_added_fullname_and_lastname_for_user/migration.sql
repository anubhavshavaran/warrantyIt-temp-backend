/*
  Warnings:

  - A unique constraint covering the columns `[FULLNAME]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[LASTNAME]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `FULLNAME` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `LASTNAME` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "FULLNAME" TEXT NOT NULL,
ADD COLUMN     "LASTNAME" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_FULLNAME_key" ON "User"("FULLNAME");

-- CreateIndex
CREATE UNIQUE INDEX "User_LASTNAME_key" ON "User"("LASTNAME");
