import { NewChatroom } from "types";
import prisma from "../../prisma";

const createChatroom = async (chatroom: NewChatroom) => {
  try {
    const newChatroom = await prisma.chatRoom.create({
      data: {
        messages: {
          create: [],
        },
        readers: {
          create: [],
        },
        writers: {
          create: [],
        },
        createdAt: chatroom.createdAt,
        updatedAt: chatroom.updatedAt,
        nightChat: {
          create: chatroom.nightChat.map(nightChat => ({
            game: {
              connect: {
                id: nightChat.game.id,
              },
            },
          })),
        },
        dayChat: {
          create: chatroom.dayChat.map(dayChat => ({
            game: {
              connect: {
                id: dayChat.game.id,
              },
            },
          })),
        },
        spirit: {
          create: chatroom.spirit.map(spiritChat => ({
            game: {
              connect: {
                id: spiritChat.game.id,
              },
            },
          })),
        },
      },
    });

    return Promise.resolve(newChatroom);
  } catch (error) {
    console.error("createChatroom.ts");
    console.error("Failed to create chatroom:", error);
    return Promise.reject(error);
  }
};

export default createChatroom;
