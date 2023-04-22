import { Request, Response } from "express";
import prisma from "../prisma";
const playerController = {
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
        usedPower: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!player) {
      res.status(404).send("Player not found");
      return;
    }
    res.status(200).json(player);
  },
};

export default playerController;
