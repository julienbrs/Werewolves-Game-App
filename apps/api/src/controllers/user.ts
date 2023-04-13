import { Request, Response } from 'express'
import prisma from '../prisma';
const jwt = require('jsonwebtoken')
const SECRET = process.env.SECRET;

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
  },
  async auth(req: Request, res: Response) {
    const { name, password } = req.body;
    
    const user = await prisma.user.findFirst({
      where: {
        name,
        password,
      },
    });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = jwt.sign({
      id: user.id,
      name: user.name,
    }, SECRET, { expiresIn: '12h' });
    res.json({ user, token });
  }
}

export default userController;