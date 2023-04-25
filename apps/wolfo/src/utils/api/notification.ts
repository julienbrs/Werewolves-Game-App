import { Notification } from "types";
import api from "./api";

const notificationApi = {
  getNotifications: async (): Promise<Notification[]> => {
    const { data } = await api.get("/notifications");
    return data;
  },
};

export const { getNotifications } = notificationApi;
