import { StateGame } from "database";
import cron from "node-cron";
import prisma from "../prisma";
import startGame from "./game/game";
import newPeriod from "./game/newPeriod";
interface JobMap {
  [key: number]: cron.ScheduledTask;
}
export const jobs: JobMap = {};

export const deleteJob = (id: number) => {
  if (jobs[id]) {
    jobs[id].stop();
    delete jobs[id];
  }
};
// check if the deadline is passed
export const checkDeadline = (date: Date) => {
  const now = new Date();
  return date < now && date;
};

export const createDeadlineJob = (deadline: Date, gameId: number, startDay: Date) => {
  const date = checkDeadline(deadline);
  const start = new Date(startDay);
  if (!date) {
    return;
  }
  if (jobs[gameId]) {
    jobs[gameId].stop();
    delete jobs[gameId];
  }
  const dateString = `${start.getUTCSeconds()} ${start.getUTCMinutes()} ${start.getUTCHours()} ${date.getUTCDate()} ${
    date.getUTCMonth() + 1
  } *`;
  const job = cron.schedule(dateString, async () => startGame(gameId));
  jobs[gameId] = job;
};

export const createNewDayJob = async (startDay: Date, gameId: number) => {
  const date = new Date(startDay);
  const cronDate = `${date.getUTCMinutes()} ${date.getUTCHours()} * * *`;
  cron.schedule(cronDate, () => newPeriod(true, gameId));
};

export const createNewNightJob = (endDay: Date, gameId: number) => {
  const date = new Date(endDay);
  const cronDate = `${date.getUTCMinutes()} ${date.getUTCHours()} * * *`;
  cron.schedule(cronDate, () => newPeriod(false, gameId));
};
// Fonction qui relance les parties en attente de joueurs dans le cas
export const relaunchGames = async () => {
  const games = await prisma.game.findMany({
    where: {
      NOT: { state: StateGame.END },
    },
    select: {
      id: true,
      state: true,
      deadline: true,
      startDay: true,
      endDay: true,
    },
  });
  games.forEach(game => {
    if (game.state === StateGame.LOBBY) {
      createDeadlineJob(game.deadline, game.id, game.startDay);
    } else if (game.state === StateGame.DAY || game.state === StateGame.NIGHT) {
      createNewDayJob(game.startDay, game.id);
      createNewNightJob(game.endDay, game.id);
    }
  });
};
