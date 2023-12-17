/*
  Warnings:

  - You are about to drop the column `compositionId` on the `grades` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `grades` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `grades` table. All the data in the column will be lost.
  - Added the required column `gradeId` to the `grade_compositions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isFinalized` to the `grade_compositions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `grade_compositions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "grades" DROP CONSTRAINT "grades_compositionId_fkey";

-- DropIndex
DROP INDEX "grades_compositionId_key";

-- AlterTable
ALTER TABLE "grade_compositions" ADD COLUMN     "gradeId" INTEGER NOT NULL,
ADD COLUMN     "isFinalized" BOOLEAN NOT NULL,
ADD COLUMN     "points" JSONB[],
ADD COLUMN     "position" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "grades" DROP COLUMN "compositionId",
DROP COLUMN "name",
DROP COLUMN "value",
ADD COLUMN     "overall" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "grade_compositions" ADD CONSTRAINT "grade_compositions_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "grades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
