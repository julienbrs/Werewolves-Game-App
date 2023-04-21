import express from "express";
import chatroomController from "../controllers/chat";
const router = express.Router();

router.get("/:id/messages", chatroomController.getMessages);
router.get("/:id/history", chatroomController.getHistory);
router.get("/:id/readers", chatroomController.getReaders);
router.get("/:id/writers", chatroomController.getWriters);
router.post("/", chatroomController.create);

export default router;
