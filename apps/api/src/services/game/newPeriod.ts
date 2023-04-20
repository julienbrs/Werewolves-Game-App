import { Role, StateGame } from "database";
import prisma from "../../prisma";
import { finishElection } from "../election";

const newPeriod = async (day: boolean, gameId: number) => {
  prisma
    .$transaction(async transaction => {
      const game = await transaction.game.findUniqueOrThrow({
        where: { id: gameId },
        select: {
          curElecId: true,
          players: {
            select: {
              userId: true,
              state: true,
              role: true,
              power: true,
            },
          },
        },
      });
      if (game.curElecId !== null) {
        await finishElection(transaction, game.curElecId, game.players);
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
    })
    .then(() => {
      console.log("New period created");
      return Promise.resolve();
    })
    .catch(error => {
      console.log(error);
      return Promise.reject(error);
    });
};

export default newPeriod;
