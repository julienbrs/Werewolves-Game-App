import dotenv from "dotenv";
dotenv.config();
export const IP = process.env.IP || "localhost";
export const PORT = process.env.PORT || 3000;
export const SECRET = process.env.SECRET || "secret";
