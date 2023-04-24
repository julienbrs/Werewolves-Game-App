import { Server } from "socket.io";
import app from "./app";
import prisma from "./prisma";
import { relaunchGames } from "./services/scheduler";
const IP = process.env.IP || "localhost";
const PORT = process.env.PORT || 3000;
relaunchGames();

const serv = app.listen(PORT, () => console.log(`Listening on http://${IP}:${PORT}`));

// Websocket server
const io = new Server(serv);

// Listen for incoming socket connections
io.on("connection", socket => {
  console.log("a user is connected to the chat");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("messagePosted", message => {
    console.log("messagePosted", message);
    prisma.message.create({
      data: {
        content: message.text,
        chatRoomId: message.chatRoomId,
        authorId: message.authorId,
        gameId: message.gameId,
      },
    });
  });
});
