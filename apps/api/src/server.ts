import cors from "cors";
import { Server, Socket } from "socket.io";
import { NewMessage } from "types";
import app from "./app";
import prisma from "./prisma";

import { relaunchGames } from "./services/scheduler";
const IP = process.env.IP || "localhost";
const PORT = process.env.PORT || 3000;

app.use(cors());
relaunchGames();

const serv = app.listen(PORT, () => console.log(`Listening on http://${IP}:${PORT}`));

// Websocket server
const io = new Server(serv, {
  cors: {
    origin: "*",
  },
});

// Listen for incoming socket connections
io.on("connection", (socket: Socket) => {
  console.log("a user is connected to the chat");

  socket.on("joinChatRoom", ({ chatRoomId, userId }) => {
    socket.join(`chatRoom-${chatRoomId}`);
    console.log(`User ${userId} joined chat room ${chatRoomId}`);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  /* export type Message = {
  id: number;
  chatRoomId: number;
  content: string;
  authorId: string;
  gameId: number;
  createdAt: Date;
  updatedAt: Date;
};

export type NewMessage = {
  chatRoomId: number;
  content: string;
  authorId: string;
  gameId: number;
}; */

  socket.on("messagePosted", async (message: NewMessage) => {
    try {
      const newMessage = await prisma.message.create({
        data: {
          content: message.content,
          author: {
            connect: {
              userId_gameId: {
                userId: message.authorId,
                gameId: message.gameId,
              },
            },
          },
          chatRoom: {
            connect: {
              id: message.chatRoomId,
            },
          },
        },
      });

      io.to(`chatRoom-${message.chatRoomId}`).emit("newMessage", newMessage);
    } catch (error) {
      console.error("Error creating and sending message:", error);
    }
  });
});
