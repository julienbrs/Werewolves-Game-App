import { Notification } from "database";
import { Request, Response } from "express";
import prisma from "../prisma";
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

const notificationController = {
  async create(req: Request, res: Response) {
    console.log(req.body);
    let body: Notification = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    const decodedToken = jwt.verify(token, SECRET);

    const notification = await prisma.notification.create({
      data: {
        ...body,
        userId: decodedToken.id,
      },
    });
    res.status(200).json(notification);
  },
  async get(req: Request, res: Response) {
    const { id } = req.params;
    const notification = await prisma.notification.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!notification) {
      res.status(404).send("Notification not found");
      return;
    }
    res.status(200).json(notification);
  },
  async getAll(req: Request, res: Response) {
    const notifications = await prisma.notification.findMany();
    if (!notifications) {
      res.status(404).send("Notifications not found");
      return;
    }
    res.status(200).json(notifications);
  },
};

export default notificationController;
