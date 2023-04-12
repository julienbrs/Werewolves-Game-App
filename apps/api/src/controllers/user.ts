import { Request, Response } from 'express'
import prisma from '../prisma';

const userController = {
  async create(req: Request, res: Response) {
    const { name, password } = req.body;
    // TODO : encrypter le password
    const user = await prisma.user.create({
      data: {
        name,
        password,
      }
    });
    // return l'user + son token avec status 201
  },
  async getUsers(req: Request, res: Response) {
    const users = await prisma.user.findMany();
    res.json(users);
  }
}

export default userController;