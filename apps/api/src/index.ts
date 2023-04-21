import cors from "cors";
import express, { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import router from "./routes/router";
import { relaunchGames } from "./services/scheduler";
const app = express();
const port = 3000;
const http = require("http");
const server = http.createServer(app);

app.use(cors({ origin: "http://localhost:3000" }));
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

// Websocket server
const io = require("socket.io")(http, {
  cors: {
    origin: "*", // cors is for cross origin resource sharing, allow all origins
  },
});

app.get("/chat", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Listen for incoming socket connections
io.on("connection", socket => {
  console.log("a user is connected to the chat");

  io.emit("message", "Un nouveau client est connecté");

  socket.on("message", message => {
    console.log("user sent a message: ", message);
    io.emit("message", `${socket.id.substr(0, 2)} said: ${message}`);
  });
});

server.listen(8080, () => console.log(`Listening websocket on http://localhost:8080}`));

app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
