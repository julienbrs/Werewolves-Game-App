import cors from "cors";
import express from "express";
import router from "./routes/router";
import { NextFunction, Request, Response, Router, ErrorRequestHandler } from "express";

const app = express();
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
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {};
app.use(errorHandler);

app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
