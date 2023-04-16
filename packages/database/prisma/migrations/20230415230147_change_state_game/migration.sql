/*
  Warnings:

  - The values [DAY,NIGHT] on the enum `StateGame` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StateGame_new" AS ENUM ('LOBBY', 'IN_GAME', 'END');
ALTER TABLE "Game" ALTER COLUMN "state" TYPE "StateGame_new" USING ("state"::text::"StateGame_new");
ALTER TYPE "StateGame" RENAME TO "StateGame_old";
ALTER TYPE "StateGame_new" RENAME TO "StateGame";
DROP TYPE "StateGame_old";
COMMIT;

-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "startDay" SET DEFAULT '08:00:00',
ALTER COLUMN "endDay" SET DEFAULT '22:00:00';
