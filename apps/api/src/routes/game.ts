import express from "express";
import gameController from "../controllers/game";
const router = express.Router({ mergeParams: true });

router.get("/", gameController.getAllNotJoinByState);
router.post("/", gameController.create);
router.get("/mygames", gameController.getMyGames);
router.post("/:id/join", gameController.joinGame);
router.post("/:id/leave", gameController.leaveGame);
router.get("/:id", gameController.get);
router.patch("/:id", gameController.updateGame);

export default router;
