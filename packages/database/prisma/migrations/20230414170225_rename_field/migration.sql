/*
  Warnings:

  - You are about to drop the column `contProp` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `insomProp` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `seerProp` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `spiritProp` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `wolfProp` on the `Game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "contProp",
DROP COLUMN "insomProp",
DROP COLUMN "seerProp",
DROP COLUMN "spiritProp",
DROP COLUMN "wolfProp",
ADD COLUMN     "contProb" INTEGER DEFAULT 0,
ADD COLUMN     "insomProb" INTEGER DEFAULT 0,
ADD COLUMN     "seerProb" INTEGER DEFAULT 0,
ADD COLUMN     "spiritProb" INTEGER DEFAULT 0,
ADD COLUMN     "wolfProb" DOUBLE PRECISION DEFAULT 0.3,
ALTER COLUMN "startDay" SET DEFAULT '08:00:00',
ALTER COLUMN "endDay" SET DEFAULT '22:00:00',
ALTER COLUMN "maxPlayer" DROP NOT NULL,
ALTER COLUMN "minPlayer" DROP NOT NULL;
