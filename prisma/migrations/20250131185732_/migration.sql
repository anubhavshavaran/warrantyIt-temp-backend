/*
  Warnings:

  - You are about to drop the column `FULLNAME` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[FIRSTNAME]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `FIRSTNAME` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_FULLNAME_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "FULLNAME",
ADD COLUMN     "FIRSTNAME" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_FIRSTNAME_key" ON "User"("FIRSTNAME");
