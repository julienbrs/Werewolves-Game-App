import express from "express";
const router = express.Router();
import userController from "../controllers/user";

router.get("/", userController.getUsers);
router.post("/", userController.create);
router.post("/login", userController.auth);
router.patch('/', userController.updateUser);

export default router;
