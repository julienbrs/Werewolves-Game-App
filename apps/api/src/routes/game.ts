import express from "express";
import gameController from "../controllers/game";
const router = express.Router({ mergeParams: true });

router.get("/", gameController.getAllNotJoinByState);
router.post("/", gameController.create);
router.get("/mygames", gameController.getMyGames);
router.post("/:id/join", gameController.join);
router.post("/:id/leave", gameController.leave);
router.get("/:id", gameController.get);
router.patch("/:id", gameController.update);
router.delete("/:id/delete", gameController.delete);

export default router;
