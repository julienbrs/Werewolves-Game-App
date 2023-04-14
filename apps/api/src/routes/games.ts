import express from "express";
const router = express.Router();
import gameController from "../controllers/game";

router.get("/", gameController.getGames);
router.post("/", gameController.create);

export default router;
