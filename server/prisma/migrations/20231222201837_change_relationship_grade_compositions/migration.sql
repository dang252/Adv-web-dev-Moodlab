/*
  Warnings:

  - You are about to drop the column `gradeId` on the `grade_compositions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "grade_compositions" DROP CONSTRAINT "grade_compositions_gradeId_fkey";

-- AlterTable
ALTER TABLE "grade_compositions" DROP COLUMN "gradeId",
ADD COLUMN     "classId" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "grade_compositions" ADD CONSTRAINT "grade_compositions_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
