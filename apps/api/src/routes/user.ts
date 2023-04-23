import express from "express";
import userController from "../controllers/user";
import checkToken from "../middleware/checkToken";
const router = express.Router({ mergeParams: true });

router.get("/", userController.getUsers);
router.get("/me", checkToken, userController.getMe);
router.post("/", userController.create);
router.post("/login", userController.auth);
router.patch("/", checkToken, userController.updateUser);
router.delete("/", checkToken, userController.deleteUser);

export default router;
