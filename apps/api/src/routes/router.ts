import { Request, Response, Router } from "express";
import userController from "../controllers/user";
const express = require("express");
const router: Router = express.Router();
import checkToken from "../middleware/checkToken";
import users from "./users";
import games from "./games";

router.use("/api/users", users);
router.use("/api/games", checkToken, games);
router.use("*", (req: Request, res: Response) => {
  res.status(404).send("Endpoint not found");
});

export default router;
