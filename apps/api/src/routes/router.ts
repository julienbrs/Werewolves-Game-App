import { Request, Response, Router } from "express";
import userController from "../controllers/user";
const express = require('express');
const router: Router = express.Router();
import checkToken from '../middleware/checkToken';


router.get('/api/users', checkToken, userController.getUsers);

router.use('*', (req: Request, res: Response) => {
  res.status(404).send('Endpoint not found');
});

export default router;