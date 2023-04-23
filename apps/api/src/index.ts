import cors from "cors";
import express, { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import prisma from "./prisma";
import router from "./routes/router";
import { relaunchGames } from "./services/scheduler";
export const app = express();
const IP = process.env.IP || "localhost";
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// This middleware adds the json header to every response
app.use("*", (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

// Assign Routes
app.use("/", router);
const errorHandler: ErrorRequestHandler = (
  _err: Error,
  _req: Request,
  _res: Response,
  _next: NextFunction
) => {};
app.use(errorHandler);
relaunchGames();

const serv = app.listen(PORT, () => console.log(`Listening on http://${IP}:${PORT}`));

// Websocket server
import { Server } from "socket.io";
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
