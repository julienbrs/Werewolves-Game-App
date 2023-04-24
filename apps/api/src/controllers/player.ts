import { Player } from "database";
import { Request, Response } from "express";
import prisma from "../prisma";
const playerController = {
  getPlayers: async (req: Request, res: Response) => {
    const { gameId } = req.params;
    const players = await prisma.player.findMany({
      where: {
        gameId: Number(gameId),
      },
    });
    if (!players) {
      res.status(404).send("Players not found");
      return;
    }
    console.log(players);
    res.status(200).json(players);
  },
  getPlayer: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { gameId } = req.params;
    const player = await prisma.player.findUnique({
      where: {
        userId_gameId: { userId: id, gameId: Number(gameId) },
      },
      select: {
        state: true,
        role: true,
        power: true,
        gameId: true,
        userId: true,
        usedPower: true,
        // user: {
        //   select: {
        //     id: true,
        //     name: true,
        //   },
        // },
      },
    });
    if (!player) {
      res.status(404).send("Player not found");
      return;
    }
    res.status(200).json(player);
  },
  updatePlayer: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { gameId } = req.params;
    const playerInfo: Player = { ...req.body };
    console.log(playerInfo);
    // delete playerInfo.user;
    const player = await prisma.player.update({
      where: {
        userId_gameId: { userId: id, gameId: Number(gameId) },
      },
      data: playerInfo,
    });
    res.status(200).json(player);
  },
};

export default playerController;
