import { Player, Power, Role, StateGame } from "database";
import prisma from "../../prisma";
import { JobType, deleteJob } from "../scheduler";

const startGame = async (gameId: number) => {
  return await prisma
    .$transaction(async transaction => {
      const game = await transaction.game.findUnique({
        where: { id: gameId },
        select: {
          id: true,
          state: true,
          minPlayer: true,
          wolfProb: true,
          seerProb: true,
          insomProb: true,
          contProb: true,
          spiritProb: true,
          dayChatRoomId: true,
          nightChatRoomId: true,
          players: {
            select: {
              userId: true,
              gameId: true,
              state: true,
              role: true,
              power: true,
              usedPower: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });
      if (!game) {
        return;
      }
      // Ajout des joueurs dans les salons de discussion
      const players = game.players;
      if (players.length < game.minPlayer) {
        await transaction.game.delete({ where: { id: gameId } });
        return Promise.resolve("Not enough players");
      }
      const playersChatters = players.map(player => ({
        gameId: player.gameId,
        playerId: player.userId,
        chatRoomId: game.dayChatRoomId,
      }));
      await transaction.reader.createMany({ data: playersChatters });
      await transaction.writer.createMany({ data: playersChatters });

      const numWerewolves = Math.max(Math.ceil(game.wolfProb * players.length), 1);
      const werewolves: Player[] = [];
      // attribution des loups garous
      while (werewolves.length < numWerewolves) {
        const randomPlayer = players[Math.floor(Math.random() * players.length)];
        if (!werewolves.includes(randomPlayer)) {
          randomPlayer.role = Role.WOLF;
          werewolves.push(randomPlayer);
        }
      }
      // Ajout des loups garous dans les salons de discussion
      const werewolfChatters = werewolves.map(werewolf => ({
        gameId: werewolf.gameId,
        playerId: werewolf.userId,
        chatRoomId: game.nightChatRoomId,
      }));
      await transaction.reader.createMany({
        data: werewolfChatters,
      });
      await transaction.writer.createMany({
        data: werewolfChatters,
      });

      // attribution des villageois
      players.forEach(player => {
        if (player.role !== Role.WOLF) {
          player.role = Role.VILLAGER;
        }
      });
      // attribution des pouvoirs
      if (Math.random() < game.seerProb) {
        const seer = players[Math.floor(Math.random() * players.length)];
        if (seer.power === Power.NONE) seer.power = Power.SEER;
      }
      let isSpirit = Math.random() < game.spiritProb;
      while (isSpirit) {
        const spirit = players[Math.floor(Math.random() * players.length)];
        if (spirit.power === Power.NONE) {
          spirit.power = Power.SPIRIT;
          isSpirit = false;
          await prisma.game.update({
            where: { id: gameId },
            data: { spiritChat: { create: {} } },
          });
        }
      }
      let isInsomniac = Math.random() < game.insomProb;
      while (isInsomniac) {
        const insomniac = players[Math.floor(Math.random() * players.length)];
        if (insomniac.role !== Role.WOLF && insomniac.power === Power.NONE) {
          insomniac.power = Power.INSOMNIAC;
          isInsomniac = false;
          await transaction.reader.create({
            data: {
              gameId,
              playerId: insomniac.userId,
              chatRoomId: game.nightChatRoomId,
            },
          });
        }
      }
      let isContaminator = Math.random() < game.contProb;
      while (isContaminator) {
        const contaminator = players[Math.floor(Math.random() * players.length)];
        if (contaminator.role !== Role.VILLAGER && contaminator.power === Power.NONE) {
          contaminator.power = Power.CONTAMINATOR;
          isContaminator = false;
        }
      }

      const playersUpdate = players.map(player => {
        return transaction.player.update({
          where: { userId_gameId: { userId: player.userId, gameId: player.gameId } },
          data: player,
        });
      });
      await Promise.all(playersUpdate); // update all players concurrently
      await transaction.game.update({
        where: { id: gameId },
        data: {
          state: StateGame.DAY,
        },
      });
    })
    .then(() => {
      deleteJob(gameId, JobType.DEADLINE);
      Promise.resolve();
    })
    .catch(error => {
      console.error(error);
    });
};

export default startGame;
