/*
  Warnings:

  - The primary key for the `Log` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `WARRANTY_ID` on the `Log` table. All the data in the column will be lost.
  - The required column `LOG_ID` was added to the `Log` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Log" DROP CONSTRAINT "Log_pkey",
DROP COLUMN "WARRANTY_ID",
ADD COLUMN     "LOG_ID" TEXT NOT NULL,
ADD CONSTRAINT "Log_pkey" PRIMARY KEY ("LOG_ID");
