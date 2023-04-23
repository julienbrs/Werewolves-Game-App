import { NewUser, User } from "types";
import api from "./api";

const userApi = {
  getUsers: async () => {
    const { data } = await api.get("/users");
    return data;
  },
  getMe: async (): Promise<User> => {
    const { data } = await api.get(`/users/me`);
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
    const { data } = await api.patch(`/users`, user);
    return data;
  },
  login: async (user: NewUser) => {
    const { data } = await api.post("/users/login", user);
    return data;
  },
};

export const { getUsers, getMe, createUser, deleteUser, updateUser, login } = userApi;
