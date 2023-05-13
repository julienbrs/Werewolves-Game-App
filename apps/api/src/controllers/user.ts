import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import prisma from "../prisma";
import { SECRET } from "../utils/env";
const jwt = require("jsonwebtoken");
const validatePassword = (password: string) => {
  const passwordRegex: RegExp =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,255}$/;
  return passwordRegex.test(password);
};
const validateUsername = (name: string) => {
  const nameRegex: RegExp = /^(?=.*[a-zA-Z])[A-Za-z\d_-]{5,20}$/;
  return nameRegex.test(name);
};

const userController = {
  async create(req: Request, res: Response) {
    const { name, password } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    if (!validateUsername(name)) {
      return res.status(400).json({
        message:
          "Username must only contain letters, digits, -, _ and be between 5 and 20 characters long, with at least one letter",
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        message:
          "Password must contain: 1 uppercase, 1 lowercase letter, 1 digit, 1 special character and be between 8 and 255 characters logn",
      });
    }

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
  async getAll(req: Request, res: Response) {
    const users = await prisma.user.findMany();
    res.json(users);
  },
  async update(req: Request, res: Response) {
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
  async getFromToken(req: Request, res: Response) {
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
  async deleteUser(req: Request, res: Response) {
    const token = req.headers.authorization?.split(" ")[1];
    const decodedToken = jwt.verify(token, SECRET);
    const id = decodedToken.id;
    prisma.user
      .delete({
        where: {
          id,
        },
      })
      .then(() => {
        res.json({ message: "User Deleted" });
      })
      .catch(error => {
        console.log(error);
        res.status(400).json({ message: "User does not exist in database" });
      });
  },
};

export default userController;
