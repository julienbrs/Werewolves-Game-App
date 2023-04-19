import express from "express";
import userController from "../controllers/user";
import checkToken from "../middleware/checkToken";
const router = express.Router();

router.get("/", userController.getUsers);
router.get("/me", checkToken, userController.getMe);
router.post("/", userController.create);
router.post("/login", userController.auth);
router.patch("/", checkToken, userController.updateUser);

export default router;
