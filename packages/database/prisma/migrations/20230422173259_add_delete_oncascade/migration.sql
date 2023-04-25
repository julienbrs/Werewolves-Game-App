-- DropForeignKey
ALTER TABLE "DayChatRoom" DROP CONSTRAINT "DayChatRoom_id_fkey";

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_curElecId_fkey";

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_dayChatRoomId_fkey";

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_nightChatRoomId_fkey";

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_spiritChatRoomId_fkey";

-- DropForeignKey
ALTER TABLE "NightChatRoom" DROP CONSTRAINT "NightChatRoom_id_fkey";

-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_gameId_fkey";

-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_userId_fkey";

-- DropForeignKey
ALTER TABLE "SpiritChatRoom" DROP CONSTRAINT "SpiritChatRoom_id_fkey";

-- DropIndex
DROP INDEX "Game_name_key";

-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "startDay" SET DEFAULT '08:00:00',
ALTER COLUMN "endDay" SET DEFAULT '22:00:00';

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_dayChatRoomId_fkey" FOREIGN KEY ("dayChatRoomId") REFERENCES "DayChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_nightChatRoomId_fkey" FOREIGN KEY ("nightChatRoomId") REFERENCES "NightChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_spiritChatRoomId_fkey" FOREIGN KEY ("spiritChatRoomId") REFERENCES "SpiritChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_curElecId_fkey" FOREIGN KEY ("curElecId") REFERENCES "Election"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NightChatRoom" ADD CONSTRAINT "NightChatRoom_id_fkey" FOREIGN KEY ("id") REFERENCES "ChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DayChatRoom" ADD CONSTRAINT "DayChatRoom_id_fkey" FOREIGN KEY ("id") REFERENCES "ChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpiritChatRoom" ADD CONSTRAINT "SpiritChatRoom_id_fkey" FOREIGN KEY ("id") REFERENCES "ChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
