import { Request, Response } from "express";
import { ChatRoom } from "types";
import prisma from "../prisma";
import createChatroom from "../services/chat/createChatroom";
import { SECRET } from "../utils/env";
const jwt = require("jsonwebtoken");

const chatroomController = {
  async create(req: Request, res: Response) {
    const chatroom: ChatRoom = req.body;
    createChatroom(chatroom)
      .then(newChatroom => {
        res.status(201).json(newChatroom);
      })
      .catch(error => {
        console.error("controllers");
        console.error("Failed to create chatroom:", error);
        res.status(400).json(error);
      });
  },
  getTodayMessages: async (req: Request, res: Response) => {
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
        authorId: true,
        author: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    res.status(200).json(messages);
  },

  async sendMessage(req: Request, res: Response) {
    const chatRoomId = Number(req.params.id);
    const { content, authorId, gameId } = req.body;

    if (isNaN(chatRoomId) || !content || !authorId || !gameId) {
      res.status(400).send("Bad request");
      return;
    }

    try {
      const newMessage = await prisma.message.create({
        data: {
          chatRoomId,
          content,
          authorId,
          gameId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      res.status(201).json(newMessage);
    } catch (error) {
      console.error("Failed to send message:", error);
      res.status(500).json(error);
    }
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
        authorId: true,
        author: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
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
  getPermissions: async (req: Request, res: Response) => {
    const chatRoomId = Number(req.params.id);
    const token = req.headers.authorization?.split(" ")[1];
    const decodedToken = jwt.verify(token, SECRET);
    const userId = decodedToken.id;
    if (isNaN(chatRoomId) || !userId) {
      res.status(400).send("Bad request");
      return;
    }
    const chatRoom = await prisma.chatRoom.findUnique({
      where: { id: chatRoomId },
      include: {
        readers: true,
        writers: true,
      },
    });
    const writePermission = chatRoom?.writers.some(writer => writer.playerId === userId);
    const readPermission = chatRoom?.readers.some(reader => reader.playerId === userId);
    res.status(200).json({ write: writePermission, read: readPermission });
  },
};

export default chatroomController;
