/*
  Warnings:

  - Made the column `maxPlayer` on table `Game` required. This step will fail if there are existing NULL values in that column.
  - Made the column `minPlayer` on table `Game` required. This step will fail if there are existing NULL values in that column.
  - Made the column `contProb` on table `Game` required. This step will fail if there are existing NULL values in that column.
  - Made the column `insomProb` on table `Game` required. This step will fail if there are existing NULL values in that column.
  - Made the column `seerProb` on table `Game` required. This step will fail if there are existing NULL values in that column.
  - Made the column `spiritProb` on table `Game` required. This step will fail if there are existing NULL values in that column.
  - Made the column `wolfProb` on table `Game` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "startDay" SET DEFAULT '08:00:00',
ALTER COLUMN "endDay" SET DEFAULT '22:00:00',
ALTER COLUMN "maxPlayer" SET NOT NULL,
ALTER COLUMN "minPlayer" SET NOT NULL,
ALTER COLUMN "contProb" SET NOT NULL,
ALTER COLUMN "insomProb" SET NOT NULL,
ALTER COLUMN "seerProb" SET NOT NULL,
ALTER COLUMN "spiritProb" SET NOT NULL,
ALTER COLUMN "wolfProb" SET NOT NULL;
