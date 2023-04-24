import express from "express";
import notificationController from "../controllers/notification";
const router = express.Router({ mergeParams: true });

router.get("/", notificationController.getAll);
router.get("/:id", notificationController.get);
router.post("/", notificationController.create);

export default router;
