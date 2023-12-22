/*
  Warnings:

  - You are about to drop the column `classId` on the `grade_compositions` table. All the data in the column will be lost.
  - You are about to drop the column `isFinalized` on the `grade_compositions` table. All the data in the column will be lost.
  - You are about to drop the `grade_points` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "grade_compositions" DROP CONSTRAINT "grade_compositions_classId_fkey";

-- AlterTable
ALTER TABLE "grade_compositions" DROP COLUMN "classId",
DROP COLUMN "isFinalized",
ADD COLUMN     "gradeId" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "grade_points";

-- CreateTable
CREATE TABLE "exams" (
    "id" SERIAL NOT NULL,
    "gradeCompositionId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT -1,
    "isFinalized" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "exams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "points" (
    "studentId" INTEGER NOT NULL,
    "examId" INTEGER NOT NULL,
    "points" DOUBLE PRECISION NOT NULL DEFAULT -1,

    CONSTRAINT "points_pkey" PRIMARY KEY ("studentId","examId")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "examId" INTEGER NOT NULL,
    "reporterId" INTEGER NOT NULL,
    "expectationPoint" DOUBLE PRECISION NOT NULL,
    "explaination" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" SERIAL NOT NULL,
    "reviewId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "grade_compositions" ADD CONSTRAINT "grade_compositions_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "grades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exams" ADD CONSTRAINT "exams_gradeCompositionId_fkey" FOREIGN KEY ("gradeCompositionId") REFERENCES "grade_compositions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "points" ADD CONSTRAINT "points_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "points" ADD CONSTRAINT "points_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "reviews"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
