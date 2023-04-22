import express from "express";
import playerController from "../controllers/player";
const router = express.Router({ mergeParams: true });

router.get("/:id", playerController.getPlayer);
router.patch("/:id", playerController.updatePlayer);
export default router;
