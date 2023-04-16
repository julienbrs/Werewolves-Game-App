import api from "./api";
import { User, NewUser } from "types";

const userApi = {
  getUsers: async () => {
    const { data } = await api.get("/users");
    return data;
  },
  getUser: async (): Promise<User> => {
    const { data } = await api.get(`/users`);
    return data;
  },
  createUser: async (user: NewUser) => {
    const { data } = await api.post("/users", user);
    return data;
  },
  deleteUser: async () => {
    const { data } = await api.delete(`/users`);
    return data;
  },
  updateUser: async (user: User) => {
    const { data } = await api.put(`/users`, user);
    return data;
  },
  login: async (user: NewUser) => {
    const { data } = await api.post("/users/login", user);
    return data;
  },
};

export const { getUsers, getUser, createUser, deleteUser, updateUser, login } = userApi;
