import { StateGame } from "database";
import cron from "node-cron";
import prisma from "../prisma";
import newPeriod from "./game/newPeriod";
import startGame from "./game/startGame";
import { checkDeadline } from "./time";
interface deadlineJobMap {
  [key: number]: cron.ScheduledTask;
}
interface newDayJobMap {
  [key: number]: cron.ScheduledTask;
}
interface newNightJobMap {
  [key: number]: cron.ScheduledTask;
}

export const JobType = {
  DEADLINE: "DEADLINE",
  NEW_DAY: "NEW_DAY",
  NEW_NIGHT: "NEW_NIGHT",
} as const;

type ObjectValues<T> = T[keyof T];

export type JobType = ObjectValues<typeof JobType>;

export const deadlineJobs: deadlineJobMap = {};
export const newDayJobs: newDayJobMap = {};
export const newNightJobs: newNightJobMap = {};

export const deleteJob = (id: number, jobType: JobType) => {
  const jobmap =
    jobType === JobType.DEADLINE
      ? deadlineJobs
      : jobType === JobType.NEW_DAY
      ? newDayJobs
      : newNightJobs;
  if (jobmap[id]) {
    jobmap[id].stop();
    delete jobmap[id];
  }
};

export const createDeadlineJob = (deadline: Date, gameId: number, startDay: Date) => {
  if (checkDeadline(deadline, startDay)) {
    return;
  }
  const date = new Date(deadline);
  const start = new Date(startDay);
  if (!date) {
    return;
  }
  if (deadlineJobs[gameId]) {
    deadlineJobs[gameId].stop();
    delete deadlineJobs[gameId];
  }
  const dateString = `${start.getUTCSeconds()} ${start.getUTCMinutes()} ${start.getUTCHours()} ${date.getUTCDate()} ${
    date.getUTCMonth() + 1
  } *`;
  console.log("cron at ", dateString);
  const job = cron.schedule(dateString, async () => startGame(gameId));
  deadlineJobs[gameId] = job;
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
