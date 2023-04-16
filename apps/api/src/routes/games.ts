import express from "express";
const router = express.Router();
import gameController from "../controllers/game";

router.get("/", gameController.getGames);
router.post("/", gameController.create);
router.get("/mygames", gameController.getMyGames);
router.post("/:id/join", gameController.joinGame);
router.post("/:id/leave", gameController.leaveGame);
router.get("/:id", gameController.getGame);
router.patch("/:id", gameController.updateGame);
export default router;
