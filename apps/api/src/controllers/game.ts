import { Request, Response } from "express";
import prisma from "../prisma";
import { NewGame } from "types";
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

const gameController = {
  async create(req: Request, res: Response) {
    const game: NewGame = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    const decodedToken = jwt.verify(token, SECRET);
    const userId = decodedToken.id;

    await prisma
      .$transaction(async (prisma) => {
        const dayChat = await prisma.dayChatRoom.create({
          data: {
            chatRoom: { create: {} },
          },
        });
        console.log(dayChat);
        const nightChat = await prisma.nightChatRoom.create({
          data: {
            chatRoom: { create: {} },
          },
        });

        const newGame = await prisma.game.create({
          data: {
            name: game.name,
            state: game.state,
            deadline: game.deadline,
            minPlayer: game.minPlayer,
            maxPlayer: game.maxPlayer,
            wolfProb: game.wolfProb,
            seerProb: game.seerProb,
            insomProb: game.insomProb,
            contProb: game.contProb,
            spiritProb: game.spiritProb,
            startDay: game.startDay,
            endDay: game.endDay,
            dayChatRoomId: dayChat.id,
            nightChatRoomId: nightChat.id,
          },
        });

        // On ajoute le créateur de la partie à la partie
        const player = await prisma.player.create({
          data: {
            userId: userId,
            gameId: newGame.id,
          },
        });

        return newGame;
      })
      .then((newGame) => {
        res.status(201).json(newGame);
      })
      .catch((error) => {
        console.log(error);
        res.status(400).json(error);
      });
  },
  async getGames(req: Request, res: Response) {
    const games = await prisma.game.findMany();
    res.json(games);
  },
};

export default gameController;
