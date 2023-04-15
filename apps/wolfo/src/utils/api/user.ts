import api from "../api";
import { NewUser, User } from "types";

const user = {
  getUsers: async () => {
    const { data } = await api.get("/users");
    return data;
  },
  createUser: async (user: NewUser) => {
    const { data } = await api.post("/users", user);
    return data;
  },
  deleteUser: async (id: number) => {
    const { data } = await api.delete(`/users/${id}`);
    return data;
  },
  updateUser: async (id: number, user: User) => {
    const { data } = await api.put(`/users/${id}`, user);
    return data;
  },
  login: async (user: NewUser) => {
    const { data } = await api.post("/users/login", user);
    return data;
  },
};

export const { getUsers, createUser, deleteUser, updateUser, login } = user;
