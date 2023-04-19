import { Request, Response, Router } from "express";
import checkToken from "../middleware/checkToken";
import games from "./game";
import users from "./user";
const express = require("express");
const router: Router = express.Router();

router.use("/api/users", users);
router.use("/api/games", checkToken, games);
router.use("*", (req: Request, res: Response) => {
  res.status(404).send("Endpoint not found");
});

export default router;
