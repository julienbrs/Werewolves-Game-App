import { StateGame } from "database";
import { Request, Response } from "express";
import { Game, NewGame } from "types";
import prisma from "../prisma";
import createGame from "../services/game/createGame";
import { JobType, deleteJob } from "../services/scheduler";
import { getTommorow } from "../services/time";
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

const gameController = {
  async create(req: Request, res: Response) {
    const game: NewGame = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    const decodedToken = jwt.verify(token, SECRET);
    const userId = decodedToken.id;
    createGame(game, userId)
      .then(newGame => {
        res.status(201).json(newGame);
      })
      .catch(error => {
        console.log(error);
        res.status(400).json(error);
      });
  },
  async get(req: Request, res: Response) {
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
          players: {
            include: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
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
  async getAllNotJoinByState(req: Request, res: Response) {
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
  async join(req: Request, res: Response) {
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
  async leave(req: Request, res: Response) {
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
  update(req: Request, res: Response) {
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
        deleteJob(gameUpdated.id, JobType.DEADLINE);
        res.status(201).json(gameUpdated);
      })
      .catch(error => {
        console.log(error);
        res.status(400).json(error);
      });
  },
  delete(req: Request, res: Response) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }
    prisma.game
      .delete({
        where: { id },
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
