import express from "express";
import chatroomController from "../controllers/chat";
const router = express.Router();

router.get("/:id/messages", chatroomController.getMessages);
router.get("/:id/history", chatroomController.getHistory);
router.post("/", chatroomController.create);

export default router;
