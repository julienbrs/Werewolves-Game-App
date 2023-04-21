import { Request, Response } from "express";
import { ChatRoom } from "types";
import prisma from "../prisma";

const chatroomController = {
  create: async (req: Request, res: Response) => {
    const chatroom: ChatRoom = req.body;
    const newChatRoom = await prisma.chatRoom.create({
      data: {
        ...chatroom,
      },
    });

    res.status(201).json(newChatRoom);
  },
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

  getReaders: async (req: Request, res: Response) => {
    const chatRoomId = Number(req.params.id);
    if (isNaN(chatRoomId)) {
      res.status(400).send("Bad chatroom id");
      return;
    }
    const chatRoom = await prisma.chatRoom.findUnique({
      where: { id: chatRoomId },
      select: {
        readers: true,
      },
    });
    res.status(200).json(chatRoom?.readers);
  },

  getWriters: async (req: Request, res: Response) => {
    const chatRoomId = Number(req.params.id);
    if (isNaN(chatRoomId)) {
      res.status(400).send("Bad chatroom id");
      return;
    }
    const chatRoom = await prisma.chatRoom.findUnique({
      where: { id: chatRoomId },
      select: {
        writers: true,
      },
    });
    res.status(200).json(chatRoom?.writers);
  },
};

export default chatroomController;
