/*
  Warnings:

  - Added the required column `authorId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gameId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "startDay" SET DEFAULT '08:00:00',
ALTER COLUMN "endDay" SET DEFAULT '22:00:00';

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "authorId" TEXT NOT NULL,
ADD COLUMN     "gameId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_authorId_gameId_fkey" FOREIGN KEY ("authorId", "gameId") REFERENCES "Player"("userId", "gameId") ON DELETE RESTRICT ON UPDATE CASCADE;
