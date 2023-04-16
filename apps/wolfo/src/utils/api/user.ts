import api from "./api";
import { User } from "types";

const user = {
  getUsers: async () => {
    const { data } = await api.get("/users");
    return data;
  },
  createUser: async (user: User) => {
    const { data } = await api.post("/users", user);
    return data;
  },
  deleteUser: async (id: number) => {
    const { data } = await api.delete(`/users`);
    return data;
  },
  updateUser: async (user: User) => {
    const { data } = await api.put(`/users`, user);
    return data;
  },
  login: async (user: User) => {
    const { data } = await api.post("/users/login", user);
    return data;
  },
};

export const { getUsers, createUser, deleteUser, updateUser, login } = user;
