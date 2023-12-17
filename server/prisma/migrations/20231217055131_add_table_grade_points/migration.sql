/*
  Warnings:

  - You are about to drop the column `gradeId` on the `grade_compositions` table. All the data in the column will be lost.
  - You are about to drop the column `points` on the `grade_compositions` table. All the data in the column will be lost.
  - Added the required column `classId` to the `grade_compositions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "grade_compositions" DROP CONSTRAINT "grade_compositions_gradeId_fkey";

-- AlterTable
ALTER TABLE "grade_compositions" DROP COLUMN "gradeId",
DROP COLUMN "points",
ADD COLUMN     "classId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "grade_points" (
    "studentId" INTEGER NOT NULL,
    "gradeCompositionId" INTEGER NOT NULL,
    "points" JSONB[],

    CONSTRAINT "grade_points_pkey" PRIMARY KEY ("studentId","gradeCompositionId")
);

-- AddForeignKey
ALTER TABLE "grade_compositions" ADD CONSTRAINT "grade_compositions_classId_fkey" FOREIGN KEY ("classId") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
