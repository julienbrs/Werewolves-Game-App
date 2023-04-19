import { StateGame } from "database";
import { Request, Response } from "express";
import { Game, NewGame } from "types";
import prisma from "../prisma";
import { checkDeadline, createDeadlineJob, deleteJob } from "../services/scheduler";
import { getTommorow } from "../services/time";
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

const gameController = {
  async create(req: Request, res: Response) {
    const game: NewGame = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    const decodedToken = jwt.verify(token, SECRET);
    const userId = decodedToken.id;
    if (!checkDeadline(new Date(game.deadline))) {
      return res.status(400).json({ message: "Invalid deadline" });
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
        res.status(201).json(newGame);
      })
      .catch(error => {
        console.log(error);
        res.status(400).json(error);
      });
  },
  async getGame(req: Request, res: Response) {
    const id: number = parseInt(req.params.id, 10);
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
    const gameId: number = parseInt(req.params.id, 10);
    if (isNaN(gameId)) {
      res.status(400).json({ error: "Invalid game id" });
      return;
    }
    prisma
      .$transaction(async transaction => {
        await transaction.player.create({
          data: {
            userId,
            gameId,
          },
        });
        const game = await transaction.game.findUniqueOrThrow({
          where: {
            id: gameId,
          },
          select: {
            maxPlayer: true,
            players: {
              select: {
                userId: true,
              },
            },
          },
        });
        if (!game) {
          throw new Error("Game not found");
        } else if (game.players.length === game.maxPlayer) {
          prisma.game.update({
            where: { id: gameId },
            data: { deadline: getTommorow() },
          });
        }
      })
      .then(player => {
        res.status(201).json({ message: "Game joined", player });
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
    const gameId: number = parseInt(req.params.id, 10);
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
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }
    const game: Game = req.body;
    prisma.game
      .update({
        where: { id },
        data: game,
      })
      .then(gameUpdated => {
        res.status(201).json(gameUpdated);
      })
      .catch(error => {
        console.log(error);
        res.status(400).json(error);
      });
  },
  start(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }
    prisma.game
      .update({
        where: { id },
        data: {
          state: StateGame.DAY,
        },
      })
      .then(gameUpdated => {
        deleteJob(gameUpdated.id);
        res.status(201).json(gameUpdated);
      })
      .catch(error => {
        console.log(error);
        res.status(400).json(error);
      });
  },
};

export default gameController;
