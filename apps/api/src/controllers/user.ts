import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import prisma from "../prisma";
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;
const userController = {
  async create(req: Request, res: Response) {
    const { name, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    try {
      const user = await prisma.user.create({
        data: {
          name,
          password: hashedPassword,
        },
      });
      // return l'user + son token avec status 201
      const token = jwt.sign(
        {
          id: user.id,
          name: user.name,
        },
        SECRET,
        { expiresIn: "7d" }
      );
      res.status(201).json({ token, message: "User created" });
    } catch (error) {
      return res.status(400).json({ message: "Name already exists" });
    }
  },
  async getUsers(req: Request, res: Response) {
    const users = await prisma.user.findMany();
    res.json(users);
  },
  async updateUser(req: Request, res: Response) {
    const token = req.headers.authorization?.split(" ")[1];
    const decodedToken = jwt.verify(token, SECRET);
    const id = decodedToken.id;

    const { name, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    prisma.user
      .update({
        where: {
          id,
        },
        data: {
          name,
          password: hashedPassword,
        },
      })
      .then(user => {
        const newToken = jwt.sign(
          {
            id: user.id,
            name: user.name,
          },
          SECRET,
          { expiresIn: "7d" }
        );
        res.json({ token: newToken, message: "User updated" });
      })
      .catch(error => {
        console.log(JSON.stringify(error));
        if (error.code === "P2002" && error.meta.target.includes("name")) {
          console.log("Name already exists");
          res.status(400).json({ message: "Name already exists" });
        } else {
          res.status(400).json({ message: "Unknown error" });
        }
      });
  },
  async auth(req: Request, res: Response) {
    const { name, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        name,
      },
    });
    if (!user) {
      return res.status(401).json({ message: "Name not found" });
    }
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Wrong password" });
    }
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
      },
      SECRET,
      { expiresIn: "7d" }
    );
    res.json({ token, message: "User logged in" });
  },
  async getMe(req: Request, res: Response) {
    const token = req.headers.authorization?.split(" ")[1];
    const decodedToken = jwt.verify(token, SECRET);
    const id = decodedToken.id;
    prisma.user
      .findUnique({
        where: {
          id,
        },
      })
      .then(user => {
        res.json(user);
      })
      .catch(error => {
        console.log(error);
        res.status(400).json(error);
      });
  },
};

export default userController;
