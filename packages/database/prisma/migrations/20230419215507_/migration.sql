/*
  Warnings:

  - The values [IN_GAME] on the enum `StateGame` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[curElecId]` on the table `Game` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gameId` to the `Election` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StateGame_new" AS ENUM ('LOBBY', 'DAY', 'NIGHT', 'END');
ALTER TABLE "Game" ALTER COLUMN "state" TYPE "StateGame_new" USING ("state"::text::"StateGame_new");
ALTER TYPE "StateGame" RENAME TO "StateGame_old";
ALTER TYPE "StateGame_new" RENAME TO "StateGame";
DROP TYPE "StateGame_old";
COMMIT;

-- AlterTable
ALTER TABLE "Election" ADD COLUMN     "gameId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "curElecId" INTEGER,
ALTER COLUMN "startDay" SET DEFAULT '08:00:00',
ALTER COLUMN "endDay" SET DEFAULT '22:00:00';

-- CreateIndex
CREATE UNIQUE INDEX "Game_curElecId_key" ON "Game"("curElecId");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_curElecId_fkey" FOREIGN KEY ("curElecId") REFERENCES "Election"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Election" ADD CONSTRAINT "Election_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
