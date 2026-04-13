/*
  Warnings:

  - A unique constraint covering the columns `[id,title]` on the table `tasks` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "trash" DROP CONSTRAINT "trash_task_id_fkey";

-- AlterTable
ALTER TABLE "trash" ADD COLUMN     "title" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "tasks_id_title_key" ON "tasks"("id", "title");

-- AddForeignKey
ALTER TABLE "trash" ADD CONSTRAINT "trash_task_id_title_fkey" FOREIGN KEY ("task_id", "title") REFERENCES "tasks"("id", "title") ON DELETE CASCADE ON UPDATE CASCADE;
