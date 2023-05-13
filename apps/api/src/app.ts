import cors from "cors";
import express, { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import router from "./routes/router";
const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// This middleware adds the json header to every response
app.use("*", (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  next();
});

// Swagger Documentation
import swaggerUi from "swagger-ui-express";
import swaggerFile from "../swagger_output.json";
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Assign Routes
app.use("/", router);

const errorHandler: ErrorRequestHandler = (
  _err: Error,
  _req: Request,
  _res: Response,
  _next: NextFunction
) => {};
app.use(errorHandler);

export default app;
