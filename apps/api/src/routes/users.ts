import express from "express";
const router = express.Router();
import userController from "../controllers/user";
import checkToken from "../middleware/checkToken";

router.get("/", userController.getUsers);
router.post("/", userController.create);
router.post("/login", userController.auth);
router.patch("/", checkToken, userController.updateUser);

export default router;
