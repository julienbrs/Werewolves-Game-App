import { Request, Response } from "express";
import prisma from "../prisma";
import { NewGame, Game } from "types";
import { StateGame } from "database";
import { gameStart } from "../utils/scheduler";
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

const gameController = {
  async create(req: Request, res: Response) {
    const game: NewGame = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    const decodedToken = jwt.verify(token, SECRET);
    const userId = decodedToken.id;

    await prisma
      .$transaction(async prisma => {
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
            ...game,
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
      .then(newGame => {
        gameStart(newGame.deadline, newGame.id)
        res.status(201).json(newGame);
      })
      .catch(error => {
        console.log(error);
        res.status(400).json(error);
      });
  },
  async getGame(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }
    prisma.game
      .findUnique({
        where: {
          id,
        },
        include: {
          players: true,
        },
      })
      .then(game => {
        res.json(game);
      })
      .catch(error => {
        console.log(error);
        res.status(400).json(error);
      });
  },
  async getGames(req: Request, res: Response) {
    const token = req.headers.authorization?.split(" ")[1];
    const decodedToken = jwt.verify(token, SECRET);
    const userId = decodedToken.id;
    const state = req.query.state as StateGame;
    prisma.game
      .findMany({
        where: {
          NOT: {
            players: {
              some: {
                userId,
              },
            },
          },
          ...(state ? { state } : {}),
        },
        select: {
          id: true,
          name: true,
          state: true,
          deadline: true,
          startDay: true,
          players: {
            select: {
              userId: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      })
      .then(games => {
        res.json(games);
      })
      .catch(error => {
        console.log(error);
        res.status(400).json(error);
      });
  },
  async getMyGames(req: Request, res: Response) {
    const token = req.headers.authorization?.split(" ")[1];
    const decodedToken = jwt.verify(token, SECRET);
    const userId = decodedToken.id;
    prisma.game
      .findMany({
        where: {
          players: {
            some: {
              userId,
            },
          },
        },
        select: {
          id: true,
          name: true,
          state: true,
          deadline: true,
          startDay: true,
          endDay: true,
          maxPlayer: true,
          players: {
            select: {
              userId: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      })
      .then(games => {
        res.json(games);
      })
      .catch(error => {
        console.log(error);
        res.status(400).json(error);
      });
  },
  async joinGame(req: Request, res: Response) {
    const token = req.headers.authorization?.split(" ")[1];
    const decodedToken = jwt.verify(token, SECRET);
    const userId = decodedToken.id;
    const gameId: number = parseInt(req.params.id);
    if (isNaN(gameId)) {
      res.status(400).json({ error: "Invalid game id" });
      return;
    }
    prisma.player
      .create({
        data: {
          userId,
          gameId,
        },
      })
      .then(player => {
        res.status(201).json({ message: "Game join", player });
      })
      .catch(error => {
        console.log(error);
        res.status(400).json(error);
      });
  },
  async leaveGame(req: Request, res: Response) {
    const token = req.headers.authorization?.split(" ")[1];
    const decodedToken = jwt.verify(token, SECRET);
    const userId = decodedToken.id;
    const gameId: number = parseInt(req.params.id);
    if (isNaN(gameId)) {
      res.status(400).json({ error: "Invalid game id" });
      return;
    }
    prisma.player
      .delete({
        where: {
          userId_gameId: {
            userId,
            gameId,
          },
        },
      })
      .then(player => {
        res.status(201).json({ message: "Game left", player });
      })
      .catch(error => {
        console.log(error);
        res.status(400).json(error);
      });
  },
  updateGame(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }
    const game: Game = req.body;
    prisma.game
      .update({
        where: { id },
        data: game,
      })
      .then(game => {
        res.status(201).json(game);
      })
      .catch(error => {
        console.log(error);
        res.status(400).json(error);
      });
  },
};

export default gameController;
