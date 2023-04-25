/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Game` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `deadline` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "contProp" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "deadline" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "insomProp" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "maxPlayer" INTEGER NOT NULL DEFAULT 20,
ADD COLUMN     "minPlayer" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "seerProp" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "spiritProp" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "wolfProp" DOUBLE PRECISION NOT NULL DEFAULT 0.3,
ALTER COLUMN "startDay" SET DEFAULT '08:00:00',
ALTER COLUMN "endDay" SET DEFAULT '22:00:00';

-- CreateIndex
CREATE UNIQUE INDEX "Game_name_key" ON "Game"("name");
