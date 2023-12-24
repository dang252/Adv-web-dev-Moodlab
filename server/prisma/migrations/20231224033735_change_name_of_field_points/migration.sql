/*
  Warnings:

  - You are about to drop the column `points` on the `points` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_pkey" PRIMARY KEY ("userId");

-- AlterTable
ALTER TABLE "points" DROP COLUMN "points",
ADD COLUMN     "point" DOUBLE PRECISION NOT NULL DEFAULT -1;
