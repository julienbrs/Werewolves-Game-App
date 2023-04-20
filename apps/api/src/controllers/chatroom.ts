import { Request, Response } from "express";
import prisma from "../prisma";
const chatroomController = {
  getMessages: async (req: Request, res: Response) => {
    const chatRoomId = Number(req.params.id);
    if (isNaN(chatRoomId)) {
      res.status(400).send("Bad chatroom id");
      return;
    }
    const messages = await prisma.message.findMany({
      where: {
        AND: [
          {
            createdAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)), // Début de la journée d'aujourd'hui
              lt: new Date(new Date().setHours(24, 0, 0, 0)), // Fin de la journée d'aujourd'hui
            },
          },
          {
            chatRoomId,
          },
        ],
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
    });
    res.status(200).json(messages);
  },
  getHistory: async (req: Request, res: Response) => {
    const chatRoomId = Number(req.params.id);
    if (isNaN(chatRoomId)) {
      res.status(400).send("Bad chatroom id");
      return;
    }
    const messages = await prisma.message.findMany({
      where: { chatRoomId },
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
    });
    res.status(200).json(messages);
  },
};

export default chatroomController;
