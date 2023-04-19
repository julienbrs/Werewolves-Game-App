import { NewGame } from "types";
import prisma from "../../prisma";
import { checkDeadline, createDeadlineJob } from "../../services/scheduler";
const createGame = async (game: NewGame, userId: string) => {
  if (!checkDeadline(new Date(game.deadline))) {
    return Promise.reject({ message: "Invalid deadline" });
  }
  await prisma
    .$transaction(async transaction => {
      const dayChat = await transaction.dayChatRoom.create({
        data: {
          chatRoom: { create: {} },
        },
      });
      console.log(dayChat);
      const nightChat = await transaction.nightChatRoom.create({
        data: {
          chatRoom: { create: {} },
        },
      });

      const newGame = await transaction.game.create({
        data: {
          ...game,
          dayChatRoomId: dayChat.id,
          nightChatRoomId: nightChat.id,
        },
      });

      // On ajoute le créateur de la partie à la partie
      await transaction.player.create({
        data: {
          userId: userId,
          gameId: newGame.id,
        },
      });

      return newGame;
    })
    .then(newGame => {
      createDeadlineJob(newGame.deadline, newGame.id, newGame.startDay);
      return Promise.resolve(newGame);
    })
    .catch(error => {
      console.log(error);
      return Promise.reject(error);
    });
};

export default createGame;
