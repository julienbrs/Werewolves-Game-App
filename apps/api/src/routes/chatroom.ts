import express from "express";
import chatroomController from "../controllers/chatroom";
const router = express.Router();

router.get("/:id/messages", chatroomController.getMessages);
router.get("/:id/history", chatroomController.getHistory);

export default router;
