-- CreateEnum
CREATE TYPE "StateGame" AS ENUM ('LOBBY', 'DAY', 'NIGHT', 'END');

-- CreateEnum
CREATE TYPE "StatePlayer" AS ENUM ('ALIVE', 'DEAD');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('WOLF', 'VILLAGER');

-- CreateEnum
CREATE TYPE "Power" AS ENUM ('INSOMNIAC', 'SEER', 'CONTAMINATOR', 'SPIRIT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" CHAR(16) NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "state" "StateGame" NOT NULL,
    "startDay" TIME NOT NULL DEFAULT '08:00:00',
    "endDay" TIME NOT NULL DEFAULT '22:00:00',
    "dayChatRoomId" INTEGER NOT NULL,
    "nightChatRoomId" INTEGER NOT NULL,
    "spiritChatRoomId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "state" "StatePlayer",
    "role" "Role",
    "power" "Power",
    "userId" TEXT NOT NULL,
    "gameId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("userId","gameId")
);

-- CreateTable
CREATE TABLE "Election" (
    "id" SERIAL NOT NULL,
    "day" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Election_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "voterId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "gameId" INTEGER NOT NULL,
    "electionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("voterId","targetId","electionId")
);

-- CreateTable
CREATE TABLE "ChatRoom" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NightChatRoom" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "NightChatRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DayChatRoom" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "DayChatRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpiritChatRoom" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "SpiritChatRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "chatRoomId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reader" (
    "playerId" TEXT NOT NULL,
    "gameId" INTEGER NOT NULL,
    "chatRoomId" INTEGER NOT NULL,

    CONSTRAINT "Reader_pkey" PRIMARY KEY ("playerId","gameId","chatRoomId")
);

-- CreateTable
CREATE TABLE "Writer" (
    "playerId" TEXT NOT NULL,
    "gameId" INTEGER NOT NULL,
    "chatRoomId" INTEGER NOT NULL,

    CONSTRAINT "Writer_pkey" PRIMARY KEY ("playerId","gameId","chatRoomId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Game_dayChatRoomId_key" ON "Game"("dayChatRoomId");

-- CreateIndex
CREATE UNIQUE INDEX "Game_nightChatRoomId_key" ON "Game"("nightChatRoomId");

-- CreateIndex
CREATE UNIQUE INDEX "Game_spiritChatRoomId_key" ON "Game"("spiritChatRoomId");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_dayChatRoomId_fkey" FOREIGN KEY ("dayChatRoomId") REFERENCES "DayChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_nightChatRoomId_fkey" FOREIGN KEY ("nightChatRoomId") REFERENCES "NightChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_spiritChatRoomId_fkey" FOREIGN KEY ("spiritChatRoomId") REFERENCES "SpiritChatRoom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_voterId_gameId_fkey" FOREIGN KEY ("voterId", "gameId") REFERENCES "Player"("userId", "gameId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_targetId_gameId_fkey" FOREIGN KEY ("targetId", "gameId") REFERENCES "Player"("userId", "gameId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "Election"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NightChatRoom" ADD CONSTRAINT "NightChatRoom_id_fkey" FOREIGN KEY ("id") REFERENCES "ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DayChatRoom" ADD CONSTRAINT "DayChatRoom_id_fkey" FOREIGN KEY ("id") REFERENCES "ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpiritChatRoom" ADD CONSTRAINT "SpiritChatRoom_id_fkey" FOREIGN KEY ("id") REFERENCES "ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reader" ADD CONSTRAINT "Reader_playerId_gameId_fkey" FOREIGN KEY ("playerId", "gameId") REFERENCES "Player"("userId", "gameId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reader" ADD CONSTRAINT "Reader_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Writer" ADD CONSTRAINT "Writer_playerId_gameId_fkey" FOREIGN KEY ("playerId", "gameId") REFERENCES "Player"("userId", "gameId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Writer" ADD CONSTRAINT "Writer_chatRoomId_fkey" FOREIGN KEY ("chatRoomId") REFERENCES "ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
