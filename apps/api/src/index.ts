import cors from "cors";
import express, { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import router from "./routes/router";
import { relaunchGames } from "./services/scheduler";
export const app = express();
const port = 3000;

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

app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
