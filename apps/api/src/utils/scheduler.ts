import cron from "node-cron";
import prisma from "../prisma";

export const gameStart = (dateS: Date, id: number) => {
  const date = new Date(dateS);
  const dateString = `${date.getUTCSeconds()} ${date.getUTCMinutes()} ${date.getUTCHours()} ${date.getUTCDate()} ${
    date.getUTCMonth() + 1
  } *`;
  cron.schedule(dateString, async () => {
    const game = await prisma.game.findUnique({
      where: { id },
      select: {
        id: true,
        state: true,
        minPlayer: true,
        players: {
          select: {
            userId: true,
          },
        },
      },
    });
    if (!game) {
      return;
    }
    if (game.players.length < game.minPlayer!) {
      // si y a pas assez de joueur on supprime la partie
      prisma.game.delete({
        where: { id },
      });
    } else if (game.state === "LOBBY") {
      // si y a assez de joueur on lance la partie
      await prisma.game.update({
        where: { id },
        data: {
          state: "IN_GAME",
        },
      });
    }
  });
};

// Fonction qui relance les parties en attente de joueurs dans le cas
export const relaunchGames = async () => {
  const games = await prisma.game.findMany({
    where: {
      state: "LOBBY",
    },
    select: {
      id: true,
      deadline: true,
    },
  });
  games.forEach(game => {
    gameStart(game.deadline, game.id);
  });
};
