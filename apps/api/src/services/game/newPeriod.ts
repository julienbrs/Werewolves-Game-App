import { Role, StateGame } from "database";
import prisma from "../../prisma";
import { finishElection } from "../election";
import { JobType, deleteJob } from "../scheduler";

const newPeriod = async (day: boolean, gameId: number) => {
  return await prisma
    .$transaction(async transaction => {
      const game = await transaction.game.findUniqueOrThrow({
        where: { id: gameId },
        select: {
          curElecId: true,
          state: true,
          players: {
            select: {
              userId: true,
              state: true,
              role: true,
              power: true,
              usedPower: true,
            },
          },
        },
      });
      if (game.curElecId !== null) {
        await finishElection(transaction, game.curElecId);
      }
      const newElec = await transaction.election.create({
        data: {
          game: {
            connect: { id: gameId },
          },
        },
      });
      const state: StateGame =
        !game.players.some(player => player.role === Role.WOLF) ||
        !game.players.some(player => player.role === Role.VILLAGER)
          ? StateGame.END
          : day
          ? StateGame.DAY
          : StateGame.NIGHT;
      await transaction.game.update({
        where: { id: gameId },
        data: {
          state,
          curElecId: newElec.id,
        },
      });
      // on supprime le job si la game est fini
      if (state === StateGame.END) deleteJob(gameId, day ? JobType.NEW_DAY : JobType.NEW_NIGHT);
    })
    .then(() => {
      console.log("New period created");
      return Promise.resolve();
    })
    .catch(error => {
      console.log(error);
    });
};

export default newPeriod;
