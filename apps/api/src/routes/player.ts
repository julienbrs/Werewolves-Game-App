import express from "express";
import playerController from "../controllers/player";
const router = express.Router({ mergeParams: true });

router.get("/", playerController.getAll);
router.get("/:id", playerController.get);
router.patch("/:id", playerController.update);
export default router;
