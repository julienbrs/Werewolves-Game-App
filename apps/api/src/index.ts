import cors from "cors";
import express, { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import router from "./routes/router";
import { relaunchGames } from "./services/scheduler";
const app = express();
const port = 3000;

app.use(cors({ origin: "http://127.0.0.1:3000" }));
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

const serv = app.listen(port, () => console.log(`Listening on http://127.0.0.1:${port}`));

// Websocket server
const io = require("socket.io")(serv);
// Listen for incoming socket connections
io.on("connection", socket => {
  console.log("a user is connected to the chat");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.emit("test", msg => {
    console.log("test:", msg);
  });

  socket.on("test-front", msg => {
    console.log("test-front:", msg);
  });
});
